import { SmsTemplateException } from "./errors";
import {
    PrepaidMeterVendData,
    SmsTemplateMessage,
    Template,
    VerifyEmailData,
    VerifyPhoneData,
} from "./interface";
export * as SmsMessage from "./interface";

const validateTemplateData = (data: any) => {
    if (!data) {
        throw new SmsTemplateException("Template data variables are required");
    }
};

export const smsMessage: SmsTemplateMessage = (options) => {
    switch (options.template) {
        case Template.VERIFY_EMAIL: {
            validateTemplateData(options.data);
            const templateData = options.data as VerifyEmailData;
            return `Hi, a confirmation code has been sent to your email, ${templateData.email.trim()}. Kindly verify your account with the code.`;
        }

        case Template.VERIFY_PHONE: {
            validateTemplateData(options.data);
            const templateData = options.data as VerifyPhoneData;
            return `Hi, You received a confirmation code on your phone, ${templateData.phone}. 
            Kindly verify your account with the code: ${templateData.code}. if you did not receive the code, kindly check your mail:`;
        }

        case Template.PREPAID_METER_VEND: {
            validateTemplateData(options.data);
            const templateData = options.data as PrepaidMeterVendData;
            return `Hi, your meter token and units are: ${templateData.token} and ${templateData.units} respectively`;
        }

        default: {
            throw new SmsTemplateException(
                "Invalid SMS template message selected"
            );
        }
    }
};
