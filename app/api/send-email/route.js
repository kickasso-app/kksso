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
import { CollectorReferralTemplate } from "services/emails/collectorReferralTemplate";
import { GenericTemplate } from "services/emails/genericTemplate";
import { getStudioByUuid } from "services/studios.server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TEST_ENV = process.env.NODE_ENV === "test";

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
  collectorReferralTemplate: CollectorReferralTemplate,
  genericTemplate: GenericTemplate,
};

export async function POST(request) {
  try {
    const { emailTemplate, emailDetails, emailVariables, recipient } = await request.json();

    const EmailTemplate = emailTemplates[emailTemplate];
    if (!EmailTemplate) {
        return NextResponse.json({ error: "Invalid email template" }, { status: 400 });
    }

    const emailHtml = await pretty(
      await render(<EmailTemplate {...emailVariables} />)
    );

    let toEmail;

    // Handle new recipient strategy
    if (recipient) {
      if (recipient.type === 'studio') {
        if (!recipient.id) {
           return NextResponse.json({ error: "Studio ID is required" }, { status: 400 });
        }
        const studio = await getStudioByUuid(recipient.id, 'email');

        console.log(studio);
        if (!studio || !studio.email) {
            console.error("Studio email not found for UUID:", recipient.id);
            return NextResponse.json({ error: "Recipient email not found" }, { status: 404 });
        }
        toEmail = [studio.email];
      } else if (recipient.type === 'user') {
        if (!recipient.email) {
           return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }
        toEmail = recipient.email;
      } else {
        return NextResponse.json({ error: "Invalid recipient type" }, { status: 400 });
      }
    } else {
      // Fallback for legacy calls (optional, can be removed if all calls are updated)
       toEmail = emailDetails?.toEmail;
    }

    // Demo override
    if (toEmail === "demo" || (Array.isArray(toEmail) && toEmail[0] === "demo")) {
        toEmail = ["delivered@resend.dev"];
    }

    if (!toEmail || (Array.isArray(toEmail) && toEmail.length === 0)) {
         return NextResponse.json({ error: "No recipient email provided" }, { status: 400 });
    }

    console.log("toEmail", toEmail);

    const fromEmail =
      emailDetails.fromEmail === "default"
        ? "Arti <hello@arti.my>"
        : emailDetails.fromEmail;

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
  } catch (error) {
    console.error("Caught error:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
