import API from "./api";

export const enrollCourse = async (courseId) => {
  const res = await API.post("/enrollments", { courseId });
  return res.data;
};

export const getMyCourses = async () => {
  const res = await API.get("/enrollments/my-courses");
  return res.data;
};

export const unenrollCourse = async (courseId) => {
  const res = await API.delete(`/enrollments/${courseId}`);
  return res.data;
};