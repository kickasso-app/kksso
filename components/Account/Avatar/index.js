import { useEffect, useState } from "react";
import { supabase } from "services/supabase";
import { useAuth } from "services/auth";

// https://supabase.com/docs/guides/with-nextjs#bonus-profile-photos

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${user.id}`);

    console.log(data);

    const name = data[1].name;
    const filePath = `${user.id}/${name}`;

    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(filePath);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      console.log(url);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(filePath);

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

// Add to Account

// Import the new component
// import Avatar from './Avatar'

// // ...

// return (
//   <div className="form-widget">
//     {/* Add to the body */}
//     <Avatar
//       url={avatar_url}
//       size={150}
//       onUpload={(url) => {
//         setAvatarUrl(url)
//         updateProfile({ username, website, avatar_url: url })
//       }}
//     />
//     {/* ... */}
//   </div>
// )
