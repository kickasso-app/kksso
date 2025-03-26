import Link from "next/link";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, Text } from "grommet";
import { Circle, ChevronLeft } from "react-feather";

const CirclePoint = ({ children }) => (
  <Box direction="row" align="center" margin={{ vertical: "small" }}>
    <Circle size={8} strokeWidth={2} />
    <Box margin={{ left: "small" }}>
      <Heading level={3} margin="none" color="dark-1">
        {children}
      </Heading>
    </Box>
  </Box>
);

const Privacy = () => {
  return (
    <Box pad="large">
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Box margin={{ bottom: "large" }}>
              <Link href="/" passHref>
                <Box direction="row" align="center" gap="small" as="a">
                  <ChevronLeft size={16} />
                  <Text>BACK</Text>
                </Box>
              </Link>
            </Box>

            <Box align="center" margin={{ bottom: "large" }}>
              <Heading level={2} margin="none">
                Privacy Policy
              </Heading>
            </Box>

            <Box margin={{ vertical: "medium" }}>
              <CirclePoint>We don't use cookies.</CirclePoint>
              <Paragraph fill>
                We take data privacy seriously and are committed to handling all
                personal data collected through the account creation and studio
                visit process in compliance with GDPR regulations. This means
                that any personal data we collect from applicants will be
                processed lawfully, fairly, and transparently.
              </Paragraph>
              <br />

              <CirclePoint>GDPR</CirclePoint>
              <Paragraph fill>
                We will only use the personal data collected for the purposes of
                managing the studio visits, and we will not share this data with
                any third parties without the explicit consent of the applicant.
              </Paragraph>
              <br />
              <Paragraph fill>
                We keep all personal data secure and will only retain it for as
                long as necessary to fulfill the purposes for which it was
                collected. Account holders have the right to request
                modification or deletion of their personal data at any time.
              </Paragraph>

              <br />

              <Paragraph fill>
                If you have any questions or concerns about how we handle
                personal data, please contact us at <b>hello@arti.my</b>.
              </Paragraph>
              <br />

              <CirclePoint>We will not spam you.</CirclePoint>
              <Paragraph fill>
                We will not spam you. You will only receive emails related to
                your account or activities on our platform.
              </Paragraph>
            </Box>
          </Col>
        </Row>
      </Grid>
    </Box>
  );
};

export default Privacy;
