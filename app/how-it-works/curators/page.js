'use client';

import React, { useContext } from "react";
import Link from "next/link";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import Footer from "layouts/Footer";

export default function CallToCuratorsPage() {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Box align="center" margin={{ top: "medium", bottom: "xlarge" }}>
                <Heading level={1} margin="none" textAlign="center">
                  Curators 
                </Heading>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={3} margin={{ bottom: "medium" }}>
                  Read First
                </Heading>
                <Link href="/how-it-works/artists">
                  How It Works for Artists
                </Link>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Our Approach to Curation
                </Heading>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  We believe that curation is an essential part of the art world, and we support an open model where artists and curators can help create their own art communities.
                </Paragraph>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  For each art community, we will work with local curators or managers to ensure that the selected studios and events represent the local art scene. The curator will be responsible for inviting artists and organizing events.
                </Paragraph>
                <Paragraph fill>
                  Artists and curators with an Arti account are able to send invitation links to a limited number of other artists and curators. This way, we ensure that the platform grows in a sustainable way and that the community grows organically.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                 Selection Strategies 
                 </Heading>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "medium" }}>
                    1. Artist and Studios 
                  </Heading>
                  <Paragraph fill margin={{ bottom: "medium" }}>
                    The initial selection is small (10-20) and while it can’t cover the local art scene, it should form a seed for a representative community as the artists invite others to join. Ideally it should contain enough variance on the basis of their career stage (emerging, middle level, established, …), age, gender, location, theme, mediums and techniques used to be able to kickstart a healthy and inclusive network organically.
                  </Paragraph>
                  <Paragraph fill>
                    We tried to apply this model in the case of Berlin, yet of course each city or community will have its own unique character. So it’s crucial for the local curator to work closely with us to ensure the initial selection would develop into a faithful map of the artists and studios on the ground who can benefit from using the Arti platform.
                  </Paragraph>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "medium" }}>
                    2. Art lovers and Collectors
                  </Heading>
            
                  <Paragraph fill>
                    The secondary focus is for art lovers and collectors. Most importantly, to invite and guide new collectors and to recommend visits that would help develop their taste and give them a kickstart in their unique collection journey.
                  </Paragraph>
                </Box>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Vision, Mission, Goals
                </Heading>
                
                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    Vision for a new art world where
                  </Heading>
                  <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>Art is more accessible to everyone</Text></li>
                      <li><Text>The creative process is more visible</Text></li>
                      <li><Text>There are more independent artists</Text></li>
                    </Box>
                  </ul>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    Mission
                  </Heading>
                  <Paragraph fill>
                    To expand the art circles
                  </Paragraph>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    Goals
                  </Heading>
                  <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>To create a sustainable web platform to connect artists, art lovers, and collectors</Text></li>
                      <li><Text>To use studios as a space to share and sell artworks directly</Text></li>
                      <li><Text>To reimagine how inspiration and art is shared</Text></li>
                    </Box>
                  </ul>
                </Box>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Local Community Manager / Curator Responsibilities
                </Heading>
                
                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    0. Role
                  </Heading>
                   <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>Moderate an active and engaged community of artists, art spaces, art lovers, and collectors.</Text></li>
                      <li><Text>Develop a strategy for building a safe and inclusive community aligned with Arti’s vision and mission.</Text></li>
                    </Box>
                  </ul>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    1. Artists
                  </Heading>
                  <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>Invite a seed of 10-20 artists / art spaces</Text></li>
                      <li><Text>Approve applying uninvited artists</Text></li>
                      <li><Text>Ensure the quality of their profiles: Assist with text and take better photos if needed</Text></li>
                      <li><Text>Follow up on visits requests & events</Text></li>
                    </Box>
                  </ul>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    2. Outreach & Events
                  </Heading>
                  <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>Invite and follow up with art enthusiasts and collectors with a focus on young and beginner collectors and help guide them to develop in their journey</Text></li>
                      <li><Text>Recommend possible collaborations and partners</Text></li>
                      <li><Text>Prepare social media content for events</Text></li>
                      <li><Text>Organise with studio tours’ guides</Text></li>
                      <li><Text>Organise monthly or bi-monthly meetup / salon</Text></li>
                    </Box>
                  </ul>
                </Box>

                <Box margin={{ vertical: "medium" }}>
                  <Heading level={3} margin={{ bottom: "small" }}>
                    3. Feedback
                  </Heading>
                  <ul>
                    <Box margin={{ left: "medium" }} gap="xsmall">
                      <li><Text>Communicate pressing community needs urgently</Text></li>
                      <li><Text>Join a bi-weekly online meeting to update on progress, retrospective</Text></li>
                      <li><Text>Present a bi-monthly status report of their community: challenges and achievements</Text></li>
                    </Box>
                  </ul>
                </Box>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Paragraph fill style={{ fontWeight: "bold" }}>
                  The first step would be to prepare 5-10 artists / studios / art spaces of the community manager’s choice and discuss them over a video call.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Finances
                </Heading>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  Currently we are completely self-funded but we are actively looking for possible investors or partners who share our vision and philosophy.
                </Paragraph>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  Since we unfortunately have no available funds or profits at the moment (which we hope will change later), we can’t offer a fixed monthly salary.
                </Paragraph>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  However, your role as a community manager at this early stage of Arti would mean you can choose one of two options:
                </Paragraph>
                <ul>
                  <Box margin={{ left: "medium", top: "small" }} gap="small">
                    <li><Text>Request an agreed upon percentage of the profit (= revenue minus expenses) of the artwork sales and events’ commissions from your specific community.</Text></li>
                    <li><Text>Become an equity partner and join us in making important and strategic decisions going forward as well as help us fundraise and elect board members.</Text></li>
                  </Box>
                </ul>
                <Paragraph fill margin={{ bottom: "medium" }}>
                  These two options are not mutually exclusive, and we may discuss other possibilities you have in mind.
                </Paragraph>
              </Box>
            </Col>
          </Row>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}