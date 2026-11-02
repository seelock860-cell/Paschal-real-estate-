export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

export const WHATSAPP_NUMBER = '09024971419';
export const WHATSAPP_INTL = '2349024971419';

export function getWhatsAppUrl(message?: string): string {
  const text = message 
    ? encodeURIComponent(message)
    : encodeURIComponent('Hello Paschal Realty, I would like to enquire about renting a luxury property in Nigeria.');
  return `https://wa.me/${WHATSAPP_INTL}?text=${text}`;
}

export function getPropertyWhatsAppUrl(propertyTitle: string, refCode: string, location: string): string {
  const message = `Hello Paschal Realty, I am interested in renting "${propertyTitle}" (Ref: ${refCode}) located in ${location}. Please provide availability and schedule a private viewing.`;
  return getWhatsAppUrl(message);
}
