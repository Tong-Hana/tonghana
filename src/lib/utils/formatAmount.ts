export const formatAmount = (amount: number): string => {
  if (amount >= 100000000) {
    const eok = amount / 100000000;
    if (eok === Math.floor(eok)) {
      return `${eok.toLocaleString()}억`;
    } else {
      return `${eok.toFixed(1).replace(".0", "")}억`;
    }
  } else if (amount >= 10000000) {
    const cheonman = amount / 10000000;
    if (cheonman === Math.floor(cheonman)) {
      return `${cheonman.toLocaleString()}천만원`;
    } else {
      return `${cheonman.toFixed(1).replace(".0", "")}천만원`;
    }
  } else if (amount >= 1000000) {
    const baekman = amount / 1000000;
    if (baekman === Math.floor(baekman)) {
      return `${baekman.toLocaleString()}백만원`;
    } else {
      return `${baekman.toFixed(1).replace(".0", "")}백만원`;
    }
  } else if (amount >= 100000) {
    const shipman = amount / 100000;
    if (shipman === Math.floor(shipman)) {
      return `${shipman.toLocaleString()}십만원`;
    } else {
      return `${shipman.toFixed(1).replace(".0", "")}십만원`;
    }
  } else if (amount >= 10000) {
    const man = amount / 10000;
    if (man === Math.floor(man)) {
      return `${man.toLocaleString()}만원`;
    } else {
      return `${man.toFixed(1).replace(".0", "")}만원`;
    }
  } else {
    return `${amount.toLocaleString()}원`;
  }
};
