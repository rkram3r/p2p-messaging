import CryptoJS from "crypto-js";

export default arrayBuffer => {
  const i8a = new Uint8Array(arrayBuffer);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return `0x${CryptoJS.SHA256(
    CryptoJS.lib.WordArray.create(a, i8a.length)
  ).toString()}`;
};
