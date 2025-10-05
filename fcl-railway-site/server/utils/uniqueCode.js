const crypto = require('crypto');

/**
 * Generate a unique code for orders
 * Format: FCL-YYYYMMDD-XXXXXXXX
 */
function generateUniqueCode() {
  const date = new Date();
  const dateStr = date.getFullYear().toString() + 
                 (date.getMonth() + 1).toString().padStart(2, '0') + 
                 date.getDate().toString().padStart(2, '0');
  
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  
  return `FCL-${dateStr}-${randomPart}`;
}

/**
 * Generate QR code data URL for unique code
 */
async function generateQRCode(uniqueCode) {
  try {
    const QRCode = require('qrcode');
    const qrCodeDataUrl = await QRCode.toDataURL(uniqueCode, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

/**
 * Register unique code on blockchain (mock implementation)
 */
async function registerOnBlockchain(uniqueCode, metadata) {
  try {
    // This is a mock implementation
    // In a real scenario, you would integrate with a blockchain service
    const mockTransactionId = `0x${crypto.randomBytes(32).toString('hex')}`;
    
    console.log(`Registering unique code ${uniqueCode} on blockchain`);
    console.log('Metadata:', metadata);
    console.log('Mock transaction ID:', mockTransactionId);
    
    return {
      success: true,
      transactionId: mockTransactionId,
      blockchainNetwork: 'ethereum'
    };
  } catch (error) {
    console.error('Error registering on blockchain:', error);
    return {
      success: false,
      message: 'Blockchain registration failed'
    };
  }
}

module.exports = {
  generateUniqueCode,
  generateQRCode,
  registerOnBlockchain
};
