// CourseRequests are request from frontend input to be saved in backend
export interface CourseRequest {
    code?: string;
    title?: string;
    description?: string;
    authors?: {id: string, is_primary_author:boolean}[];
}

export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    primary_author: User;
    co_authors: User[];
    topics: Topic[];
}


export interface Topic {
    id: string;
    name: string;
    course_id: string;
    questions: Question[]
}

export interface TopicRequest {
    name: string;
    course_id: string;
}

export interface Question {
    id: string;
    question_text: string;
    question_type: string;
    topic_id: string;
    answers: Answer[];
    author_id: string;
    difficulty: string;
    image: string;
    score: number;
}

export interface QuestionRequest {
    question_text: string;
    question_type: string;
    topic_id: string;
    answers: AnswerRequest[]
    difficulty: string;
    image: string,
    score: number
}

export interface QuestionValues {
    question_text: string;
    question_type: string;
    topic_id: string;
    answers: AnswerRequest[]
    difficulty: string;
    image: File,
    score: number
}

export interface Answer {
    id:string;
    answer_text: string;
    is_correct: boolean;
    question_id: string;
}

export interface AnswerRequest {
    id?: string;
    answer_text: string;
    is_correct: boolean;
}

export interface UserRequest {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    department_id?: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    department_id: string;

}

export interface UserLogin {
    email: string;
    password: string;
}


export interface QuestionPrint {
    id: string;
    question_text: string;
    question_type: string;
    topic_id: string;
    answers: AnswerPrint[];
    author_id: string;
    selected?: boolean;
    score: number;
    image: string;
    difficulty: string;
}

interface AnswerPrint {
    id: string;
    answer_text: string;
    is_correct: boolean;
    question_id: string;
    point?: number;
}

export interface Assessment {
    id?: string;
    name: string;
    user_id: string;
    topics: Topic []
    assessment_topics?: {id: string, topic: Topic}[]
}

export interface Cloudinary {
    secure_url: string;
}

export type CourseUpdateDTO = Partial<Course>

export type TopicUpdateDTO = Partial<Topic>


export type QuestionUpdateDTO = Partial<Question>

export type UserDTO = Partial<User>


