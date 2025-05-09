import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = {
  type: "service_account",
  project_id: "be9ik-wallet",
  private_key_id: "1f7418ffedffe074646fe7c0c82cd77f599e4285",
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDo3DeQAicWzBgK\nZgM6fePXdww+sNXTEwk5zJMPt0BtFB8HYQlTYNlRuIfVhwA5IRpZuVxVMzR/RkEv\ntrCJAB0X1CO2JPlOGb7aAOVlnwVJlwbwP2wMxLyhC0rQhD17Z+CRjF+LkUoFLn8r\n+cIFB02e2j1WB0Wed4L6L2ZZM0f76lR8RGTIo9SQn64jocBCdqh+9tvr+GAal+cU\nI9SPJtBiafnJhYy31ln61PCXlzqWIDzcBbIEs0xhEuZtEk2DpGXfhF734C6q8zyY\niG3LyOeOEMTCwsAzXZc+am8LSFrM5Xu3y6CyHf6t0IvsGwzZoY2bMApiYQ4VOd4t\nxF72TbeTAgMBAAECggEADtWQmJT6hoJD+c2b4QsKC7ziw8+iH4sz6EG3EKY87XX9\nsAune29NCN63kIvEIN+R/StIzYiwjHceSfrabi/aqpzyFXVviGEtflfWRU4HGTQM\n1htEN+AEoEHG51e1TvpEHSGTKKH91CytH1EO4iEf+cGvbJ6T+c9lQajpXT9eE5cv\n5PYHcoodZT5dgH/XzBZxc4SZRmkv2Jvl7hunxPOVXlsB+qh/ZfXi6wlFir23Tm3H\n40k/gXZM3Z0z8W+6vQCVW44GpWHj/6Lcc/gWEwP2ZNGloLWhah6KW5yymGK5KLzv\nXFQ8oTg0HwmxuTTl4128G2rbY+VO8HLatPWc/npW8QKBgQD0Za8PYDnxVRckO6sp\nWiRBYXBrvb9CfcXw55AWbxwkRzPS6K7y0dt9eom8eD2dVc6bG7yvDkcELuagzAft\nZnN0R1snmSAhU3O7Yxq5NWMnomWi8N5hfR8hQeibAmqp3fN5cZYy0U1ZckUXJkRw\ni29WlbUqSZp3Yf6vkxK5fjX9WwKBgQDz6lEfqLN48pSSj2ZaVIhEiOOH2TV7cM9a\nbXnvgn7pDztIMa/Ip8liusdlqoZPzGx4LICEPMQRgZMg3FrAdcZp1EoxVgKekgDg\n/zDgPT1gtUcI5zb09GwspDTsbw//0g8g6q/Ch4wSXNn0/lW3NSP11Os4eGNTcyrM\n/5pJjH2sKQKBgQDgnxx4m05l+njcemLkDM9JsA6tV6YTrJliwtFxbQmGZlLBQ86X\nqj17ZEZ3jGPE2XqcoK+YjRzEQX8CxsN6dDEk6/hhuqEHQDYcQgfrtZ++a8nSKmOZ\nYnBcFsF8xonWOgJu2fDcH/ZhgV7y2d8JOX5JLCtoBGIN22lDYX9SMSfaBQKBgCxL\n+5uiSaXHeE/9lvsEqxK3QYskWWAnpqCnjSOAMYgl6gA8dc4dGqfBgADorSfE2lYg\nzt41Iu6C97NaEWkuenAxy5+WHTerEFnMPpYayRDNGy90vjhSQ2sAD1R4/xDYl0LF\nHFJZx4h2MGcb4Xk6P2Of3XAN/QvkuHsuWFjPGOuxAoGBAKDnHqmyp8jA2ebouPKW\n+88YZ9U17l9ZqkitTyulmuORD5HKlLQWIRxEMpIbXABV0JeNcHCHJD8zF+gG8Xnk\n5SGQhWx+JMN4qLEutb/gTbyBQRJLdG/HfFzZzS1v7jzNhBX6x0HxD3zO/deUB+pb\naVMbHDu8iKcImE/v0zHEXTO6\n-----END PRIVATE KEY-----\n`,
  client_email: "firebase-adminsdk-fbsvc@be9ik-wallet.iam.gserviceaccount.com",
  client_id: "114550873223533605392",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40be9ik-wallet.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const app = !getApps().length ? initializeApp({
  credential: cert(serviceAccount as any),
  databaseURL: "https://be9ik-wallet-default-rtdb.firebaseio.com"
}) : getApp();

const db = getDatabase(app);

export { db };
