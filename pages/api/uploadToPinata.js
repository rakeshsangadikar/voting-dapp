import axios from 'axios';
import { PINATA_UPLOAD_URL, PINATA_JWT, PINATA_GATEWAY_URL } from '../../lib/constant';

export const uploadToPinata = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({ name: file.name });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({ cidVersion: 1 });
  formData.append('pinataOptions', options);

  const res = await axios.post(PINATA_UPLOAD_URL, formData, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: PINATA_JWT,
    },
  });
  
  return PINATA_GATEWAY_URL + res.data.IpfsHash;
};
