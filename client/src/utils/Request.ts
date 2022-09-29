import axios, {AxiosResponse} from 'axios';
import {
    Course,
    CourseRequest,
    Topic,
    TopicRequest,
    QuestionRequest,
    Question,
    UserRequest,
    QuestionPrint,
    User, TopicUpdateDTO, QuestionUpdateDTO, UserLogin, UserDTO,
    Assessment,
} from "./Type";

export const getCourses = async () => {
    const response: AxiosResponse<Course[] | { message: string }> = await axios.get<Course[]>("/api/v1/courses/").catch(error => error.response);
    return response;
}

export const queryCourse = async (queryString: string) => {
    const response: AxiosResponse<Course[] | { message: string }> = await axios.get<Course[]>("/api/v1/courses/all" + queryString).catch(error => error.response);
    return response;
}

export const createCourse = async (values: CourseRequest) => {
    const response: AxiosResponse<Course | { message: string }> = await axios.post<Course>("/api/v1/courses/", values).catch(error => error.response);
    return response;
}


export const getCourseById = async (id: string) => {
    const response: AxiosResponse<Course | { message: string }> = await axios.get<Course>(`/api/v1/courses/${id}`).catch(error => error.response);
    return response;
}

export const updateCourse = async (id: string, course: CourseRequest) => {
    const response: AxiosResponse<Course | { message: string }> = await axios.put<Course>(`/api/v1/courses/${id}`, course).catch(error => error.response);
    return response;
}

export const deleteCourse = async (id: string) => {
    const response: AxiosResponse<Course | { message: string }> = await axios.delete<Course>(`/api/v1/courses/${id}`).catch(error => error.response);
    return response;
}

export const createTopic = async (values: TopicRequest) => {
    const response: AxiosResponse<Topic | { message: string }> = await axios.post<Topic>("/api/v1/topics/", values).catch(error => error.response);
    return response;
}


export const getTopicById = async (id: string) => {
    const response: AxiosResponse<Topic | { message: string }> = await axios.get<Topic>(`/api/v1/topics/${id}`).catch(error => error.response);
    return response;
}

export const updateTopic = async (id: string, topic: TopicUpdateDTO) => {
    const response: AxiosResponse<Topic | { message: string }> = await axios.put<Topic>(`/api/v1/topics/${id}`, topic).catch(error => error.response);
    return response;
}

export const deleteTopic = async (id: string) => {
    const response: AxiosResponse<Topic | { message: string }> = await axios.delete<Topic>(`/api/v1/topics/${id}`).catch(error => error.response);
    return response;
}


export const createQuestion = async (values: QuestionRequest) => {
    console.log(values);
    const response: AxiosResponse<Question | { message: string }> = await axios.post<QuestionRequest>("/api/v1/questions/", values).catch(error => error.response);
    return response;
}

export const updateQuestion = async (id: string, question: QuestionUpdateDTO) => {
    const response: AxiosResponse<Question | { message: string }> = await axios.put<Question>(`/api/v1/questions/${id}`, question).catch(error => error.response);
    return response;
}

export const deleteQuestion = async (id: string) => {
    const response: AxiosResponse<Question | { message: string }> = await axios.delete<Question>(`/api/v1/questions/${id}`).catch(error => error.response);
    return response;
}

export const createUser = async (user: UserRequest) => {
    const response: AxiosResponse<User | { message: string }> = await axios.post<User>("/api/v1/users/", user).catch(error => error.response);
    return response;
}

export const getAllUsers = async () => {
    const response: AxiosResponse<User[] | { message: string }> = await axios.get<User[]>("/api/v1/users/").catch(error => error.response);
    return response;
}

export const updateUser = async (user: UserDTO) => {
    const response: AxiosResponse<User | { message: string }> = await axios.put<User>(`/api/v1/users/${user.id}`, user).catch(error => error.response);
    return response;
}

export const downloadFile = async (questions: { "questions": QuestionPrint[], type: string, assessment_name:string }) => {
    const response: AxiosResponse<{
        "message": string,
        "filename": string,
    }> = await axios.post(`/api/v1/questions/create_file`, questions).catch(error => error.response);
    const filename = response.data.filename;

    const {data}: AxiosResponse<Blob> = await axios.get(`/api/v1/questions/download/${filename}`, {
        responseType: 'blob'
    }).catch(error => error.response);
    // Download the data blob
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return data;
}

export const getCurrentUser = async () => {
    const response: AxiosResponse<UserDTO | { message: string }> = await axios.get<User>("/api/v1/users/current").catch(error => error.response);
    return response;
}
export const loginUser = async (user: UserLogin) => {
    const response: AxiosResponse<User | { message: string }> = await axios.post<User>("/api/v1/users/login", user).catch(error => error.response);
    return response;
}


export const logoutUser = async () => {
    const response: AxiosResponse<{ message: string }> = await axios.post<User>("/api/v1/users/logout").catch(error => error.response);
    return response;
}

export const createAssessment = async (assessment: Assessment) => {
    const response: AxiosResponse<Assessment | { message: string }> = await axios.post<Assessment>("/api/v1/assessments/", assessment).catch(error => error.response);
    return response;
}

export const getAssessment = async (id: string) => {
    const response: AxiosResponse<Assessment | { message: string }> = await axios.get(`/api/v1/assessments/${id}`).catch(error => error.response);
    return response;
}