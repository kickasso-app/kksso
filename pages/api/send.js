import { Resend } from "resend";
import { render } from "@react-email/render";

import { TestTemplate } from "services/emails/testTemplate";
import { ReferralTemplate } from "services/emails/referralTemplate";
import { VisitRequest } from "services/emails/visitRequest";
import { VisitRequestConfirmation } from "services/emails/visitRequestConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplates = {
  testTemplate: TestTemplate,
  referralTemplate: ReferralTemplate,
  visitRequest: VisitRequest,
  visitRequestConfirmation: VisitRequestConfirmation,
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emailTemplate, emailDetails, emailVariables } = req.body;

  const EmailTemplate = emailTemplates[emailTemplate];

  const emailHtml = await render(<EmailTemplate {...emailVariables} />, {
    pretty: true,
  });

  // console.log(emailHtml);

  try {
    const toEmail =
      emailDetails.toEmail === "demo"
        ? ["delivered@resend.dev"]
        : emailDetails.toEmail;
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
    // FOR TEST
    // const data = { dataisok: true };
    // const error = false;
    if (error) {
      console.log("Error details:", error);
      return res.status(400).json(error);
    }

    return res.status(200).json(data);
  } catch (error) {
    // console.log("Caught error:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
};
