import {Course, Question, User} from "../../utils/Type";
import {CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import EditQuestion from "./Edit";
import ViewQuestion from "./View";
import DestroyQuestion from "./Destroy";
import React, {useContext, useEffect, useState} from "react";
import Show from "./Show";
import UserContext from "../UserContextApi";
import {getAllUsers, getCourseById} from "../../utils/Request";

interface IndexProps {
    courseId: string,
    questions: Question[];
    updateQuestionState: (question: Question) => void;
    deleteQuestionState: (question: Question) => void;
}

const Index: React.FC<IndexProps> = ({courseId, questions, updateQuestionState, deleteQuestionState}) => {

    const [permission, setPermission] = useState(false)
    const user = useContext(UserContext)

    useEffect(() => {
        const setup = async () => {

            const response = await getCourseById(courseId);
            if (response.status === 200) {
                const course = response.data as Course;
                if (course.primary_author.id === user?.id) {
                    setPermission(true)
                } else {
                    setPermission(false)
                }
            }
        }
        setup();
    }, [])

    if (!user) {
        return <CircularProgress/>
    }

    return (
        <TableContainer component={Paper} className="w-full max-w-[1000px]">
            <Table aria-label="simple table" >
                <TableHead style={{background: "#F9F9FA"}}>
                    <TableRow>
                        <TableCell style={{width: 50}} className="text-lg">No.</TableCell>
                        <TableCell align="left" className="text-lg">Question</TableCell>
                        <TableCell align="right" className="text-lg">
                            <Show questions={questions} label="Show All"/>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question, index) => (
                        <TableRow
                            key={question.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row" className="text-lg">
                                {index + 1}
                            </TableCell>
                            <TableCell align="left" className="truncate text-ellipsis max-w-[180px] text-lg">{question.question_text}</TableCell>
                            <TableCell align="right" className="flex items-center gap-x-2 text-lg">
                                {(permission || user.id === question.author_id) &&
                                <DestroyQuestion question={question} deleteQuestionState={deleteQuestionState}/>
                                }
                                {(permission || user.id === question.author_id) && <span>|</span>}
                                <EditQuestion question={question} updateQuestionState={updateQuestionState}/>
                                |
                                <ViewQuestion question={question} index={index}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Index