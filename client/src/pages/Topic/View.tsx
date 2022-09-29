import {
    CircularProgress
} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getTopicById} from "../../utils/Request";
import {Question, Topic} from "../../utils/Type";
import CreateQuestion from "../Question/Create";
import Index from "../Question/Index";
import BreadCrumbs from "../Shared/Breadcrumbs";
import LinearProgress from "@mui/material/LinearProgress";

const View = () => {
    const params = useParams();
    const [topic, setTopic] = useState<Topic | undefined>();

    useEffect(() => {
        const setup = async () => {
            if (params.id) {
                const response = await getTopicById(params.id);
                if (response.status === 200) {
                    setTopic(response.data as Topic);
                }
            }
        }
        setup();
    }, [])


    if (!topic) {
        return (
            <div className="flex flex-col w-full min-h-screen">
                <LinearProgress/>
            </div>
        );
    }

    const updateQuestionState = (question: Question) => {
        const index = topic.questions.findIndex(q => q.id === question.id);
        if (index >= 0) {
            const questions = topic.questions;
            questions[index].question_text = question.question_text
            questions[index].question_type = question.question_type
            questions[index].answers = question.answers
            questions[index].score = question.score
            questions[index].image = question.image
            questions[index].difficulty = question.difficulty
            setTopic({...topic, questions: questions});
        }
    }

    const deleteQuestionState = (question: Question) => {
        const questions = topic.questions.filter(q => q.id !== question.id);
        setTopic({...topic, questions: questions});
    }

    const addQuestionState = (question: Question) => {
        setTopic({...topic, questions: [...topic.questions, question]});
    }

    return (
        <div className="min-w-full h-auto min-h-screen flex flex-col">

            <BreadCrumbs link={`/courses/${topic.course_id}`} pageTitle={topic.name}/>

            <div className="flex flex-col gap-y-7">
                <div className="flex justify-between">
                    <CreateQuestion addQuestionState={addQuestionState}/>
              

                </div>
                <Index questions={topic.questions} updateQuestionState={updateQuestionState}
                       deleteQuestionState={deleteQuestionState} courseId={topic.course_id}/>
            </div>
        </div>
    )
}

export default View