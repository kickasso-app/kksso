"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Text } from "grommet";

import { useFeatured } from "services/featured";

const FeaturedSection = () => {
  const { featuredItems, fetchFeaturedItems } = useFeatured();

  useEffect(() => {
    fetchFeaturedItems();
  }, [fetchFeaturedItems]);

  if (!featuredItems?.length) return null;

  return (
    <Box margin={{ vertical: "xlarge" }} gap="large">
      {featuredItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          style={{ textDecoration: "none" }}
        >
          <Box width="100%">
            <Box
              width="100%"
              overflow="hidden"
              style={{ containerType: "inline-size", maxHeight: "66.667cqw" }}
            >
              <Image
                src={item.photoUrl}
                alt={item.title}
                width={1200}
                height={800}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
            <Text margin={{ top: "small" }} textAlign="start">
              {item.type === "studio" && (
                <>
                  <b>From the studio of</b>
                  <br />
                {[item.title, item.subtitle].filter(Boolean).join(", ")}
                </>
              )}
            </Text>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default FeaturedSection;
