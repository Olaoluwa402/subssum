import { Global, Module } from "@nestjs/common";
import { EmailService } from "./services/email.service";
import * as nodemailer from "nodemailer";
import Email from "email-templates";
import { resolve } from "path";
import { mailConfig } from "@/config";
import BrevoTransport from "nodemailer-brevo-transport";

@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: EmailService,
            useFactory() {
                const brevoTransport = nodemailer.createTransport(
                    new BrevoTransport({
                        apiKey: mailConfig.apiKey,
                    })
                );

                const email = new Email({
                    message: {
                        from: {
                            name: mailConfig.senderName,
                            address: mailConfig.senderEmail,
                        },
                    },
                    views: {
                        root: resolve("public/templates/emails"),
                        options: {
                            extension: "ejs",
                        },
                    },
                    transport: brevoTransport,
                    send: true,
                });

                return new EmailService(email);
            },
            inject: [],
        },
    ],
    exports: [EmailService],
})
export class EmailModule {}
