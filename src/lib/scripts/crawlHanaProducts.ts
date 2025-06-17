import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "@/lib/prisma";
import { RiskLevel } from "@prisma/client";
import { ProductCategory } from "@prisma/client";

const riskLevelMap: Record<string, RiskLevel> = {
  "매우낮은위험(H)": RiskLevel.VERY_LOW,
  "매우낮은위험(UH)": RiskLevel.VERY_LOW,
  "낮은위험(H)": RiskLevel.LOW,
  "낮은위험(UH)": RiskLevel.LOW,
  "보통위험(H)": RiskLevel.MEDIUM,
  "보통위험(UH)": RiskLevel.MEDIUM,
  "다소높은위험(H)": RiskLevel.LITTLE_HIGH,
  "다소높은위험(UH)": RiskLevel.LITTLE_HIGH,
  "높은위험(H)": RiskLevel.HIGH,
  "높은위험(UH)": RiskLevel.HIGH,
  "매우높은위험(H)": RiskLevel.VERY_HIGH,
  "매우높은위험(UH)": RiskLevel.VERY_HIGH,
};

const fundTypes = {
  "02": "주식형",
  "03": "혼합주식형",
  "01": "채권형",
  "04": "혼합채권형",
  "05": "단기금융(MMF)",
  "06": "파생형",
  "07": "부동산",
  "09": "재간접",
  "12": "혼합자산",
} as const;

type Fund = {
  val2: string; // 계열/비계열 구분
  val4: string; // 국내/해외/혼합 구분
  val5: string; // 펀드명
  val9: string; // 위험등급
  val11: string; // 설정일 이후 수익률
  val12: string; // 6개월 수익률
  val13: string; // 1년 수익률
  val14: string; // 3년 수익률
  val15: string; // 5년 수익률
};

const parser = new XMLParser();
const URL = "https://dis.kofia.or.kr/proframeWeb/XMLSERVICES/";

// 1. 유효한 최신 기준일 가져오기
async function fetchLatestValidStandardDate(): Promise<string> {
  const payload = `<?xml version="1.0" encoding="utf-8"?>
  <message>
    <proframeHeader>
      <pfmAppName>FS-DIS2</pfmAppName>
      <pfmSvcName>DISSalEpsRopSO</pfmSvcName>
      <pfmFnName>selectStdDt</pfmFnName>
    </proframeHeader>
    <systemHeader></systemHeader>
    <COMDataDynmDTO></COMDataDynmDTO>
  </message>`;

  const res = await axios.post(URL, payload, {
    headers: {
      "Content-Type": "application/xml",
    },
  });

  // 유효한 기준일자 파싱
  const parsedData = parser.parse(res.data);
  const standardDate =
    parsedData.root?.message?.COMDataDynmListDTO?.COMDataDynmDTO?.standardDt;

  if (!standardDate) throw new Error("기준일을 가져올 수 없습니다");
  return standardDate;
}

// 2. 하나은행 계열 펀드 목록 가져오기
async function fetchHanaBankFundList(standardDt: string, fundType: string) {
  const payload = `<?xml version="1.0" encoding="utf-8"?>
  <message>
    <proframeHeader>
      <pfmAppName>FS-DIS2</pfmAppName>
      <pfmSvcName>DISSalEpsRopSO</pfmSvcName>
      <pfmFnName>selectRtn</pfmFnName>
    </proframeHeader>
    <systemHeader></systemHeader>
    <COMDataDynmDTO>
      <standardDt>${standardDt}</standardDt>
      <companyCd>A02024</companyCd>
      <val3>${fundType}</val3>
    </COMDataDynmDTO>
  </message>`;

  const res = await axios.post(URL, payload, {
    headers: { "Content-Type": "application/xml" },
  });

  const parsedData = parser.parse(res.data);
  // console.dir(parsedData, { depth: 5 });      // 전체 파싱 결과 출력

  const funds = parsedData.root?.message?.COMDataDynmListDTO?.COMDataDynmDTO;

  if (!funds) {
    console.log("펀드 정보 없음");
    return;
  }

  // 하나은행 계열 펀드만 필터링
  const filtered = funds.filter((fund: Fund) => fund.val2 === "계열");

  for (const fund of filtered) {
    // DB에 저장
    await prisma.hanaProduct.create({
      data: {
        name: fund.val5,
        category: getProductCategory(fundType, fund.val4, fund.val5),
        description: "",
        interestRate: Number(fund.val13) || 0, // 1년 수익률 없다면 0으로 설정
        maxInterestRate: Number(fund.val11), // 설정일 이후 수익률
        minAmount: 0,
        maxAmount: 0,
        minPeriodMonth: 0,
        maxPeriodMonth: 0,
        riskLevel: riskLevelMap[fund.val9],
      },
    });
  }
}

function getProductCategory(
  fundType: string,
  region: string,
  name: string,
): ProductCategory {
  if (fundType === "02" || fundType === "09") {
    if (region === "국내") return ProductCategory.DOMESTIC_STOCKS;
    else if (region === "해외" || region === "혼합") {
      if (
        name.match(
          /성장|이머징|신흥국|신흥시장|아시아|퍼시픽|중국|인도|브라질|러시아|china|india|brazil|russia/,
        )
      ) {
        return ProductCategory.EMERGING_STOCKS;
      } else return ProductCategory.DEVELOPED_STOCKS;
    }
  } else if (fundType === "03" || fundType === "06") {
    if (region === "국내" || region === "혼합")
      return ProductCategory.DOMESTIC_STOCKS;
    else if (region === "해외") {
      if (
        name.match(
          /성장|이머징|신흥국|신흥시장|아시아|퍼시픽|중국|인도|브라질|러시아|china|india|brazil|russia/,
        )
      ) {
        return ProductCategory.EMERGING_STOCKS;
      } else return ProductCategory.DEVELOPED_STOCKS;
    }
  } else if (fundType === "01" || fundType === "04" || fundType === "12") {
    if (region === "국내" || region === "혼합")
      return ProductCategory.DOMESTIC_BONDS;
    else return ProductCategory.FOREIGN_BONDS;
  } else if (fundType === "05") {
    return ProductCategory.CASH;
  } else if (fundType === "07") {
    return ProductCategory.ALTERNATIVE;
  }
  throw new Error(`알 수 없는 펀드 유형: ${fundType} 또는 지역: ${region}`);
}

// 펀드 크롤링 순차 처리 실행
(async () => {
  try {
    const standardDT = await fetchLatestValidStandardDate();
    console.log(`📅 최신 기준일: ${standardDT}`);

    for (const fundType in fundTypes) {
      const code = fundType as keyof typeof fundTypes;
      const label = fundTypes[code];
      await fetchHanaBankFundList(standardDT, code);
      console.log(`\n🔍 [${label} | 코드: ${code}] 펀드 유형 조회 중...`);
    }

    console.log("✅ 모든 유형의 펀드 정보 순차 조회 완료");
  } catch (err) {
    console.error("에러 발생:", err);
  }
})();

// 금융상품 - 예금 페이지 목록 크롤링
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

interface Product {
  category: string;
  // channel: string[];
  name: string;
  description: string;
  min_rate: string;
  max_rate: string;
}

// 예금상품 크롤링
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const targetUrl =
    "https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608";

  // 네트워크가 0개 이하로 조용해질 때까지 대기
  await page.goto(targetUrl, { waitUntil: "networkidle0" });

  const content = await page.content();
  const $ = cheerio.load(content);

  const products: Product[] = [];

  const items = $("ul.product-list > li.item");

  for (const el of items) {
    const category = ProductCategory.SAVINGS;
    // const category = $(el).find('.product-tit > i').text().trim(); // 세부카테고리(정기예금...)

    // const channel = $(el)
    //   .find('.product-tit em.badge02, .product-tit em.badge34, .product-tit em.null')
    //   .map((_, em) => $(em).text().trim())
    //   .get();
    const name = $(el).find(".product-tit > em a").text().trim();

    const description = $(el).find(".tit-desc a").text().trim();

    const rateElems = $(el).find("strong");
    const min_rate = $(rateElems[0])
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();
    const max_rate = $(rateElems[1])
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();

    products.push({
      category,
      // channel,
      name,
      description,
      min_rate,
      max_rate,
    });

    // DB 저장
    await prisma.hanaProduct.create({
      data: {
        name: name,
        category: category,
        description: description,
        interestRate: min_rate,
        maxInterestRate: max_rate || 0,
        minAmount: 0,
        maxAmount: 0,
        minPeriodMonth: 0,
        maxPeriodMonth: 0,
        riskLevel: RiskLevel.VERY_LOW,
      },
    });
  }

  console.log(products);
  await browser.close();
})();

// // 적금 상품 크롤링
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   const page = await browser.newPage();

//   const targetUrl = 'https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608';

//   // 네트워크가 0개 이하로 조용해질 때까지 대기
//   await page.goto(targetUrl, { waitUntil: 'networkidle0' });

//   // 적금 탭 클릭: onclick에 doTab('spb_2812') 있는 a 태그 클릭
//   await page.evaluate(() => {
//     const anchors = Array.from(document.querySelectorAll('a'));
//     const target = anchors.find(a => a.getAttribute('onclick')?.includes("doTab('spb_2812')"));
//     if (target) {
//       target.click();
//     }
//   });
//   // 페이지가 로딩 될 시간을 줌
//   await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});

//   const content = await page.content();
//   const $ = cheerio.load(content);

//   const products: Product[] = [];

//   $('ul.product-list > li.item').each((_, el) => {
//     const category = $(el).find('.product-tit > i').text().trim();

//     // const channel = $(el)
//     // .find('.product-tit em.badge02, .product-tit em.badge34, .product-tit em.null')
//     // .map((_, em) => $(em).text().trim())
//     // .get();

//     const name = $(el).find('.product-tit > em a').text().trim();

//     const description = $(el).find('.tit-desc a').text().trim();

//     const rateElems = $(el).find('strong');
//     const min_rate = $(rateElems[0]).clone().children().remove().end().text().trim();
//     const max_rate = $(rateElems[1]).clone().children().remove().end().text().trim();

//     products.push({
//       category,
//     // channel,
//       name,
//       description,
//       min_rate,
//       max_rate,
//     });
//   });

//   console.log(products);
//   await browser.close();
// })();

// // 대출 상품 크롤링
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   const page = await browser.newPage();

//   const targetUrl = 'https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608';

//   // 네트워크가 0개 이하로 조용해질 때까지 대기
//   await page.goto(targetUrl, { waitUntil: 'networkidle0' });

//   // 적금 탭 클릭: onclick에 doTab('spb_2821,spb_2822,spb_2823,spb_2824,spb_2825,spb_2826') 있는 a 태그 클릭
//   await page.evaluate(() => {
//     const anchors = Array.from(document.querySelectorAll('a'));
//     const target = anchors.find(a => a.getAttribute('onclick')?.includes("doTab('spb_2821,spb_2822,spb_2823,spb_2824,spb_2825,spb_2826')"));
//     if (target) {
//       target.click();
//     }
//   });

//    // 페이지가 로딩 될 시간을 줌
//   await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});

//   const products: Product[] = [];
//   let currentOffset = 0; // 페이징 파라미터

//   async function crawlCurrentPage() {
//     const content = await page.content();
//     const $ = cheerio.load(content);

//     $('ul.product-list > li.item').each((_, el) => {
//       const category = $(el).find('.product-tit > i').text().trim();

//       // const channel = $(el)
//       //   .find('.product-tit em.badge02, .product-tit em.badge34, .product-tit em.null')
//       //   .map((_, em) => $(em).text().trim())
//       //   .get();

//       const name = $(el).find('.product-tit > em a').text().trim();

//       const description = $(el).find('.tit-desc a').text().trim();

//       const rateElems = $(el).find('strong');
//       const min_rate = $(rateElems[0]).clone().children().remove().end().text().trim();
//       const max_rate = $(rateElems[1]).clone().children().remove().end().text().trim();

//       products.push({
//         category,
//         // channel,
//         name,
//         description,
//         min_rate,
//         max_rate,
//       });
//     });
//     console.log(products);
//   }

//     // 크롤링 시작
//     while (true) {
//       await crawlCurrentPage();

//       // 다음 페이지 offset 존재 여부 확인
//       const nextOffset = await page.evaluate(() => {
//         const currentPageEl = document.querySelector('.paging a.on');
//         if (!currentPageEl) return null;

//         // 현재 페이지 strong 태그 기준으로 다음 a 태그를 찾음
//         const strongEl = currentPageEl.querySelector('strong');
//         if (!strongEl) return null;

//         let nextLink = strongEl.parentElement?.nextElementSibling as HTMLAnchorElement;
//         while (nextLink && nextLink.tagName !== 'A') {
//           nextLink = nextLink.nextElementSibling as HTMLAnchorElement;
//         }

//         if (!nextLink || !nextLink.getAttribute('href')?.includes('doPaging')) return null;

//         // href에서 숫자 추출
//         const match = nextLink.getAttribute('href')?.match(/doPaging\('(\d+)'\)/);
//         return match ? parseInt(match[1]) : null;
//       });

//       if (nextOffset === null || nextOffset <= currentOffset) {
//         break;
//       }

//       currentOffset = nextOffset;

//       // doPaging 함수 호출해서 페이지 이동
//       await page.evaluate((offset) => {
//         // @ts-ignore
//         window.doPaging(offset.toString());
//       }, currentOffset);

//       // 페이지가 로딩 될 시간을 줌
//       await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
//     }

//     console.log(products);

//     await browser.close();
//   })();
