export enum Template {
    VERIFY_EMAIL = "VERIFY_EMAIL",
    PREPAID_METER_VEND = "PREPAID_METER_VEND",
    VERIFY_PHONE = "VERIFY_PHONE",
}

export interface MessageOptions<T extends Template = Template> {
    template: T;
    data?: T extends keyof SMSTemplateDataMap ? SMSTemplateDataMap[T] : never;
}

export type SMSTemplateDataMap = {
    [Template.VERIFY_EMAIL]: VerifyEmailData;
    [Template.VERIFY_PHONE]: VerifyPhoneData;
    [Template.PREPAID_METER_VEND]: PrepaidMeterVendData;
};

export interface VerifyEmailData {
    email: string;
}

export interface VerifyPhoneData {
    phone: string;
    email: string;
    code: string;
}

export interface PrepaidMeterVendData {
    token: string;
    units: string;
}

export type SmsTemplateMessage = <T extends Template = Template>(
    options: MessageOptions<T>
) => string;
