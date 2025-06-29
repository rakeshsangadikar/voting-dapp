import axios from 'axios';

const postUrl = process.env.NEXT_PUBLIC_PINATA_UPLOAD_URL;
const jwtToken = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;
const readUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;

export const uploadToPinata = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({ name: file.name });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({ cidVersion: 1 });
  formData.append('pinataOptions', options);

  const res = await axios.post(postUrl, formData, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: jwtToken,
    },
  });
  
  return readUrl + res.data.IpfsHash;
};
