import api from "../config/api";

export const createBloodReceive = async (data) => {
  const response = await api.post("/blood-receive/create", data);
  return response.data;
};

export const getBloodReceiveByStatus = async (statusArr) => {
  // statusArr: array of string
  const params = new URLSearchParams();
  statusArr.forEach((s) => params.append("status", s));
  const response = await api.get(`/blood-receive/list-by-status?${params.toString()}`);
  return response.data;
};

export const getBloodReceiveById = async (id) => {
  const response = await api.get(`/blood-receive/get/${id}`);
  return response.data;
};

export const getBloodReceiveByUserId = async (userId) => {
  const response = await api.get(`/blood-receive/get-blood-receive-by-user-id?userId=${userId}`);
  return response.data;
};

export const updateBloodReceive = async (id, data) => {
  const response = await api.put(`/blood-receive/update/${id}`, data);
  return response.data;
};

export const updateBloodReceiveStatus = async (id, status) => {
  const response = await api.patch(`/blood-receive/update-status/${id}?status=${status}`);
  return response.data;
};


export const setCompleteBloodReceive = async ({  bloodID , implementationDate, unit }) => {
  const response = await api.post("/blood-receive/set-complete", {
    bloodID ,
    implementationDate,
    unit,
  });
  return response.data;
};

export const getBloodReceiveHistory = async () => {
  const response = await api.get("/blood-receive/get-list-receive");
  return response.data;
}; 