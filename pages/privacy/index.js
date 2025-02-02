import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Text } from "grommet";
import { Circle, ChevronLeft } from "react-feather";

import styles from "pages/about/index.module.scss";

const Privacy = () => {
  return (
    <section>
      <Grid fluid className={styles.about}>
        <Row>
          <Col xs={12}>
            <Box margin="large">
              <a href="/" className={styles.backlink}>
                <ChevronLeft className={styles.icon} size={16} /> BACK
              </a>
              <center>
                <h3></h3>
              </center>
              <h2>Privacy policy</h2>
              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp; We don't use
                  cookies.
                </Box>
              </h3>

              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp;GDPR
                </Box>
              </h3>

              <p>
                - We take data privacy seriously and are committed to handling
                all personal data collected through the account creation and
                studio visit process in compliance with GDPR regulations. This
                means that any personal data we collect from applicants will be
                processed lawfully, fairly, and transparently.
              </p>
              <p>
                - We will only use the personal data collected for the purposes
                of managing the studio visits, and we will not share this data
                with any third parties without the explicit consent of the
                applicant.
              </p>
              <p>
                - We keep all personal data secure and will only retain it for
                as long as necessary to fulfill the purposes for which it was
                collected. Account holders have the right to request
                modification or deletion of their personal data at any time.
              </p>
              <p>
                - If you have any questions or concerns about how we handle
                personal data, please contact us at{" "}
                <b>arti.studiosapp@gmail.com.</b>
              </p>

              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp; We will not spam
                  you.
                </Box>
              </h3>

              {/* <p>
                A key difference between seeing an artist's work in a gallery
                and visiting their studio is the stories they share. The details
                of how and why they work are a significant part of their
                practice. We hope to bring the possibility of sharing and
                getting inspired by art to more art lovers.
              </p>
              <ul>
                <li> All accounts are and will always be free.</li>
                <li>
                  Your data is private. We will not use it without your consent.
                </li>
                <li> We will not spam you.</li>
                <li>
                  <Text weight={600}>
                    {" "}
                    We do not tolerate any kind of sexism, racism and other
                    forms of discrimination.
                  </Text>
                </li>
              </ul>

              <p>
                Layout of sincere privacy policy A sincere privacy policy should
                outline the following essential elements:
                <br />
                <br />
                Data Collection: Clearly state what type of data is being
                collected, how it is collected, and why it is necessary. Be
                specific about the types of data collected, such as personal
                identifiable information (PII), browsing history, or device
                information.
                <br />
                <br />
                Data Use: Explain how the collected data is used, including any
                third-party sharing or processing. Be transparent about the
                purposes of data use, such as marketing, analytics, or security
                purposes.
                <br />
                <br />
                Data Storage and Retention: Specify the duration for which data
                is stored and the measures taken to ensure its security and
                integrity. This includes the types of security measures
                implemented to protect data, such as encryption and access
                controls.
                <br />
                <br />
                Data Subject Rights: Outline the rights of data subjects,
                including the right to access, rectify, erase, restrict
                processing, and object to processing. Be clear about the
                procedures for exercising these rights.
                <br />
                <br />
                Consent: Clearly explain the consent process, including the
                types of data being collected and the purposes of collection.
                Ensure that consent is freely given, specific, informed, and
                unambiguous.
                <br />
                <br />
                Data Breach Notification: Outline the procedures for notifying
                data subjects in the event of a data breach, including the types
                of information to be disclosed and the timeline for
                notification.
                <br />
                <br />
                Data Protection Officer: Identify the Data Protection Officer
                (DPO) or the person responsible for ensuring compliance with
                data protection regulations.
                <br />
                <br />
                Contact Information: Provide contact information for data
                subjects to exercise their rights or seek more information about
                the privacy policy.
                <br />
                <br />
                Updates and Changes: Specify the procedures for updating and
                changing the privacy policy, including the notice period for
                changes and the mechanisms for obtaining consent. By including
                these elements, a sincere privacy policy demonstrates
                transparency, accountability, and respect for the privacy of
                individuals.
              </p> */}
            </Box>
          </Col>
        </Row>
      </Grid>
    </section>
  );
};
export default Privacy;
