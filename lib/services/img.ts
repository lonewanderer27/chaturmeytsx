import axios from 'axios';
import { DocumentPickerAsset } from 'expo-document-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system';

const img = axios.create({
  baseURL: process.env.EXPO_PUBLIC_IMG_COE,
});

const IMGService = {
  async image(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async top(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/top',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async bottom(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/bottom',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async course(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/course',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async studentName(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/student_name',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async studentNo(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/student_no',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async yearLevel(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/year_level',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async semester(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/semester',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
  async blockNo(coeBase64: string, name: string) {
    const fd = new FormData();
    fd.append('coe', {
      uri: coeBase64,
      name: name,
      type: 'application/pdf',
    } as unknown as Blob, name);

    const response = await img.post<Blob>(
      '/image/block_no',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export default IMGService;
