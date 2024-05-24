import React, { useState } from 'react';
import axios from 'axios';

const StravaGPXUploader = () => {
  const [file, setFile] = useState(null);
  const [routeId, setRouteId] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadGPX = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://www.strava.com/api/v3/uploads', formData, {
        params: { access_token: '8726cf6097df41bd991dcc15743d421804f4107b' },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setRouteId(response.data.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getRouteStreams = async () => {
    try {
      const response = await axios.get(`https://www.strava.com/api/v3/routes/${routeId}/streams/latlng,elevation,time`, {
        params: { access_token: '8726cf6097df41bd991dcc15743d421804f4107b' },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadGPX}>Cargar GPX</button>
      {routeId && <button onClick={getRouteStreams}>Obtener flujos de datos de ruta</button>}
    </div>
  );
};

export default StravaGPXUploader;