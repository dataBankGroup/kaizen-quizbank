import React, { useContext, useEffect, useState } from "react";
import { Assessment, Topic, Question, QuestionPrint } from "../../utils/Type";
import UserContext from "../UserContextApi";
import { downloadFile, getAssessment } from "../../utils/Request";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "react-router-dom";
import BreadCrumbs from "../Shared/Breadcrumbs";
import Card from "@mui/material/Card";
import { FieldArray, Form, Formik } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PreviewProps {
  questions: QuestionPrint[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  isSubmitting: boolean;
}

const Preview: React.FC<PreviewProps> = ({
  questions,
  setFieldValue,
  isSubmitting,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let counter = 0;

  return (
    <>
      <Button
        variant="contained"
        className="flex w-32 h-10 font-bold bg-neutral-700 hover:bg-neutral-600"
        type="button"
        onClick={handleOpen}
      >
        Preview Quiz
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            outline: "none",
          }}
          className="w-full max-w-[674px] max-h-[600px] overflow-y-scroll flex flex-col divide-y space-y-4 rounded-md"
        >
          <div className="flex flex-col ">
            <h5 className="text-xl text-amber-400 font-bold ">Quiz Preview</h5>
            {questions.map((question, index) => {
              if (question.selected) {
                counter += 1;
                return (
                  <Card className="mt-3 pl-5 pr-7 pt-6 pb-4 relative ">
                    <IconButton
                      component="span"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        setFieldValue(
                          `questions.${index}.selected`,
                          !question.selected
                        );
                      }}
                    >
                      <CloseIcon className="fill-delete h-4 w-4" />
                    </IconButton>
                    <p className="block font-semibold text-lg text-justify">
                      {`${counter}.  ${question.question_text} (${question.score} pts)`}
                    </p>

                    {question.image !== "" && (
                      <div className="flex items-center justify-center">
                        <img
                          src={question.image}
                          className="h-[250px] w-auto "
                          alt="Question"
                        />
                      </div>
                    )}

                    {question.answers.length > 1 ? (
                      question.answers.map((answer, ind) => {
                        return (
                          <div
                            key={answer.id}
                            className="block px-6 pt-1 text-sm"
                          >
                            <span
                              className={`text-lg text-justify ${
                                answer.is_correct && "text-[#70C250] "
                              }`}
                            >
                              {question.question_type !== "enumeration"
                                ? String.fromCharCode(97 + ind) + ". "
                                : "- "}
                              {`${answer.answer_text} `}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        key={question.answers[0].id}
                        className="block px-6 pt-1 text-sm"
                      >
                        <p
                          className={`text-justify text-lg ${
                            question.answers[0].is_correct && "text-[#70C250] "
                          }`}
                        >
                          {`${question.answers[0].answer_text} `}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              }
            })}

            {questions.filter((question) => question.selected === true)
              .length == 0 ? (
              <p className="text-sm text-center py-10 text-lg italic">
                No Questions Selected.
              </p>
            ) : (
              <>
                <div className="flex justify-between mt-4 mb-8">
                  <button
                    className="font-bold  text-lg text-amber-400"
                    onClick={() =>
                      setFieldValue(
                        "questions",
                        questions
                          .map((value) => ({
                            value,
                            sort: Math.random(),
                          }))
                          .sort((a, b) => a.sort - b.sort)
                          .map(({ value }) => value)
                      )
                    }
                  >
                    SHUFFLE
                  </button>

                  <button
                    className="font-bold  text-lg text-delete"
                    onClick={() =>
                      setFieldValue(
                        "questions",
                        questions.map((question) => {
                          question.selected = false;
                          return question;
                        })
                      )
                    }
                  >
                    CLEAR QUESTIONS
                  </button>
                </div>

                <Button
                  variant="contained"
                  className="w-44 max-w-44 h-10 font-bold bg-neutral-700 hover:bg-neutral-600"
                  type="submit"
                  form="create-quiz"
                  disabled={isSubmitting}
                  onClick={() => setFieldValue("type", "csv")}
                >
                  Export CSV
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Button
                    variant="contained"
                    className="w-44 h-auto font-bold bg-neutral-700 hover:bg-neutral-600"
                    type="submit"
                    form="create-quiz"
                    disabled={isSubmitting}
                    onClick={() => setFieldValue("type", "teacher")}
                  >
                    Export PDF (Teacher)
                  </Button>
                  <Button
                    variant="contained"
                    className="w-44 h-auto font-bold bg-neutral-700 hover:bg-neutral-600"
                    type="submit"
                    form="create-quiz"
                    disabled={isSubmitting}
                    onClick={() => setFieldValue("type", "student")}
                  >
                    Export PDF (Student)
                  </Button>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

const Export = () => {
  const [questions, setQuestions] = useState<QuestionPrint[] | undefined>();
  const user = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    const setup = async () => {
      // setting up the data by requesting the courses from backend
      if (params.id) {
        const response = await getAssessment(params.id);
        if (response.status === 200) {
          const assessment = response.data as Assessment;

          let assessment_questions: QuestionPrint[] = [];
          assessment.assessment_topics?.map((assessment_topic) => {
            assessment_topic.topic.questions.map((question) => {
              question.answers = question.answers.map((answer) => {
                return { ...answer, point: 0 };
              });
              assessment_questions.push({ ...question, selected: false });
            });
          });
          setQuestions(assessment_questions);
        }
      }
    };
    setup();
  }, []);

  if (!questions || !user) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <LinearProgress />
      </div>
    );
  }

  return (
    <div className="w-full h-auto min-h-screen">
      <div className="flex flex-col w-full">
        <BreadCrumbs link="/create-quiz" pageTitle="Create a Quiz" />
        <Formik
          initialValues={{
            questions: questions,
            assessment_name: "",
            type: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await downloadFile({
              ...values,
              questions: values.questions.filter(
                (question) => question.selected === true
              ),
            });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, values, handleChange, setFieldValue }) => (
            <Form id="create-quiz">
              <div className="flex flex-col sm:flex-row  justify-end max-w-[1000px] mb-5 gap-4 ">
                <Preview
                  questions={values.questions}
                  setFieldValue={setFieldValue}
                  isSubmitting={isSubmitting}
                />
              </div>
              <TableContainer
                component={Paper}
                className="w-full max-w-[1020px]"
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead style={{ background: "#F9F9FA" }}>
                    <TableRow className="divide-x divide-x-400">
                      <TableCell
                        style={{ width: 50, fontWeight: "bold" }}
                        className="text-lg"
                      >
                        No.
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold" }}
                        align="left"
                        className="text-lg"
                      >
                        Question
                      </TableCell>
                      <TableCell
                        style={{ width: 50, fontWeight: "bold" }}
                        align="center"
                        className="text-lg"
                      >
                        Scores
                      </TableCell>
                      <TableCell
                        style={{ width: 50, fontWeight: "bold" }}
                        align="center"
                        className="text-lg"
                      >
                        Add Question
                        <Checkbox
                          color="success"
                          checked={values.questions.every(
                            (question) => question.selected === true
                          )}
                          onChange={(e) => {
                            setFieldValue(
                              "questions",
                              values.questions.map((question) => {
                                question.selected = e.target.checked;
                                return question;
                              })
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {values.questions.map((question, index) => {
                      return (
                        <TableRow
                          key={question.id}
                          className="divide-x divide-gray-200"
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="text-lg"
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="left"
                            className="w-full max-w-[750px]"
                          >
                            <div className="flex flex-col">
                              <p className="font-semibold text-lg">
                                {question.question_text}
                              </p>

                              {question.image !== "" && (
                                <div className="flex items-center justify-center">
                                  <img
                                    src={question.image}
                                    className="h-[250px] w-auto "
                                    alt="Question"
                                  />
                                </div>
                              )}

                              {question.answers.length > 1 ? (
                                question.answers.map((answer, ind) => {
                                  return (
                                    <div
                                      key={answer.id}
                                      className="flex items-center gap-x-4  pt-1 pl-10"
                                    >
                                      <p
                                        className={`text-lg  ${
                                          answer.is_correct && "text-[#70C250]"
                                        }`}
                                      >
                                        {String.fromCharCode(97 + ind)}.{" "}
                                        {answer.answer_text}
                                      </p>
                                    </div>
                                  );
                                })
                              ) : (
                                <div
                                  key={question.answers[0].id}
                                  className="flex items-center gap-x-4 pt-1  pl-10"
                                >
                                  <p
                                    className={`text-lg ${
                                      question.answers[0].is_correct &&
                                      "text-[#70C250]"
                                    }`}
                                  >
                                    {question.answers[0].answer_text}
                                  </p>
                                </div>
                              )}
                              <p className="opacity-60 capitalize mt-5 text-right">
                                {`(${
                                  question.difficulty
                                }) ${question.question_type.replaceAll(
                                  "_",
                                  " "
                                )}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell align="center" className=" max-w-[20px]">
                            <p>{question.score}</p>
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              color="success"
                              name={`questions.${index}.selected`}
                              checked={question.selected}
                              onChange={handleChange}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Export;
