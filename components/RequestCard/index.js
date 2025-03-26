import { useRouter } from "next/router";

import { Box, Button, Card, Grid, Text } from "grommet";
import { FormNext } from "grommet-icons";

const statusColors = {
  Pending: "brand",
  Approved: "accent-1",
  Rejected: "dark-3",
};

const statusTitles = {
  Pending: "New",
  Approved: "Confirmed",
  Rejected: "Denied",
};

const RequestCard = ({
  request: {
    request_id,
    has_response,
    response,
    requestor_name,
    studio_name,
    requestor_email,
    request_date,
    request_date_tz,
    requestor_link,
    messages,
  },
}) => {
  const router = useRouter();

  const articleLink = {
    pathname: "/requests/[id]",
    query: { id: request_id },
  };

  const onOpen = () => {
    router.push(articleLink);
  };

  const status = !has_response ? "Pending" : response ? "Approved" : "Rejected";

  return (
    <Box fill onClick={() => onOpen(request_id)}>
      <Card
        background="background-front"
        pad="medium"
        margin={{ vertical: "large" }}
        round="4px"
      >
        <Box align="start">
          <Text weight="bold">{request_date}</Text>
        </Box>
        <Grid columns={["auto", "xsmall"]} gap="medium" align="center">
          <Box gap="xsmall">
            <Box align="start">
              <Box
                direction="row"
                gap="small"
                margin={{ vertical: "medium" }}
                wrap
              >
                <Text size="small" color="dark-3">
                  From: <b> {requestor_name} </b>
                </Text>
                {/* <Text size="small" color="dark-3">
                  •{requestor_email}
                </Text> */}
                {/* {requestor_link && (
                  <Text size="small" color="brand">
                    •{" "}
                    <a
                      href={requestor_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      View Profile
                    </a>
                  </Text>
                )} */}
                {/* <Text size="small" color="dark-3">
                  • {messages?.length || 0} messages
                </Text> */}
              </Box>
            </Box>

            <Box
              background={statusColors[status]}
              pad={{ horizontal: "medium", vertical: "xsmall" }}
              round="2px"
              width="fit-content"
            >
              <Text size="small">{statusTitles[status]}</Text>
            </Box>
          </Box>

          <Box align="end">
            <Button
              width="xsmall"
              icon={<FormNext />}
              hoverIndicator
              onClick={() => onOpen(request_id)}
              tip="View details"
            />
          </Box>
        </Grid>
      </Card>
    </Box>
  );
};

export default RequestCard;
