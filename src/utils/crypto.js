import CryptoJS from 'crypto-js';

/**
 * 加密工具模块
 * [CONCEPT] 使用AES加密算法保护本地存储数据
 * [PATTERN] 单例模式：统一管理加密/解密逻辑
 */

// 从环境变量获取密钥，如果未设置则使用默认值
// WARNING: 在生产环境中应该使用更安全的密钥管理方式
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || 'default-secret-key';

/**
 * AES加密方法
 * @param {string} data - 需要加密的数据
 * @returns {string} - 加密后的字符串
 * 
 * [PERF] 使用UTF8编码提高中文处理性能
 */
export const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    // 返回原始数据，确保程序可以继续运行
    return data;
  }
};

/**
 * AES解密方法
 * @param {string} encryptedData - 加密的字符串
 * @returns {string} - 解密后的数据
 * 
 * 错误写法示例：
 * // 直接返回解密结果，没有错误处理
 * return CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
 */
export const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    // 解密失败时返回空字符串，避免出现undefined
    return '';
  }
};

/**
 * 测试加密功能是否正常工作
 * @returns {boolean} - 测试是否通过
 */
export const testCrypto = () => {
  const testData = 'test-data';
  const encrypted = encrypt(testData);
  const decrypted = decrypt(encrypted);
  return testData === decrypted;
};

// [PERF] 预热加密模块
testCrypto();
