import API from "./api";

export const enrollCourse = async (courseId) => {
  const res = await API.post("/api/enrollments", { courseId });
  return res.data;
};

export const getMyCourses = async () => {
  const res = await API.get("/api/enrollments/my-courses");
  return res.data;
};