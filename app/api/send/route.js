import { Resend } from "resend";
import { render, pretty } from "@react-email/render";
import { NextResponse } from 'next/server';

import { TestTemplate } from "services/emails/testTemplate";
import { NewsletterTemplate } from "services/emails/newsletterTemplate";
import { ReferralTemplate } from "services/emails/referralTemplate";
import { VisitRequest } from "services/emails/visitRequest";
import { VisitRequestConfirmation } from "services/emails/visitRequestConfirmation";
import { EventRequest } from "services/emails/eventRequest";
import { EventRequestConfirmation } from "services/emails/eventRequestConfirmation";
import { ResponseVisitRequest } from "services/emails/responseVisitReqTemplate";
import { ResponseEventRequest } from "services/emails/responseEventReqTemplate";
import { MagicLinkTemplate } from "services/emails/magicLinkTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplates = {
  testTemplate: TestTemplate,
  referralTemplate: ReferralTemplate,
  visitRequest: VisitRequest,
  visitRequestConfirmation: VisitRequestConfirmation,
  eventRequest: EventRequest,
  eventRequestConfirmation: EventRequestConfirmation,
  responseVisitRequest: ResponseVisitRequest,
  responseEventRequest: ResponseEventRequest,
  newsletterTemplate: NewsletterTemplate,
  magicLinkTemplate: MagicLinkTemplate,
};

const TEST_ENV = false;

export async function POST(request) {
  try {
    const { emailTemplate, emailDetails, emailVariables } = await request.json();

    const EmailTemplate = emailTemplates[emailTemplate];
    if (!EmailTemplate) {
        return NextResponse.json({ error: "Invalid email template" }, { status: 400 });
    }

    const emailHtml = await pretty(
      await render(<EmailTemplate {...emailVariables} />)
    );

    const toEmail =
      emailDetails.toEmail === "demo"
        ? ["delivered@resend.dev"]
        : emailDetails.toEmail;
    const fromEmail =
      emailDetails.fromEmail === "default"
        ? "Arti <hello@arti.my>"
        : emailDetails.fromEmail;

    if (TEST_ENV === false) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: emailDetails.subject,
        html: emailHtml,
      });
      
      if (error) {
        console.log("Error details:", error);
        return NextResponse.json(error, { status: 400 });
      }
      return NextResponse.json(data);
    } else {
      // FOR TEST
      return NextResponse.json({ dataisok: true });
    }
  } catch (error) {
    console.error("Caught error:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
