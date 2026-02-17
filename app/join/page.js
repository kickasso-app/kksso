import JoinClient from './JoinClient';

export const metadata = {
  title: "Join Arti - Sign Up or Login",
  description: "Join Arti to connect with artists, art lovers, and collectors.",
};

export default async function JoinPage({ searchParams }) {
  const { referral } = await searchParams;
  return <JoinClient referral={referral} />;
}
