import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { FieldArray, Form, Formik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import {
  Question,
  QuestionValues,
  QuestionRequest,
  Cloudinary,
} from "../../utils/Type";
import * as yup from "yup";
import { updateQuestion } from "../../utils/Request";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import axios, { AxiosResponse } from "axios";

interface AnswerFieldProps {
  name: string;
  values: QuestionValues;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const AnswerField: React.FC<AnswerFieldProps> = ({
  name,
  values,
  handleChange,
}) => {
  const isMultipleChoice = values.question_type === "multiple_choice";
  const isEssay = values.question_type === "essay";
  const isTrueOrFalse = values.question_type === "true_or_false";
  const isEnumeration = values.question_type === "enumeration";
  const isHidden = isEssay || isTrueOrFalse;

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <>
          {values.answers &&
            values.answers.map((answer, index) => {
              return (
                <div key={index} className="col-span-full grid grid-cols-6">
                  {isTrueOrFalse || isMultipleChoice ? (
                    <TextField
                      id="outlined-basic"
                      label={`Answer ${index + 1}`}
                      variant="outlined"
                      name={`answers.${index}.answer_text`}
                      className={`col-start-1 ${
                        isEssay ? " col-span-6" : " col-span-5"
                      }`}
                      value={answer.answer_text}
                      onChange={(e) => {
                        if (!isTrueOrFalse) {
                          handleChange(e);
                        }
                      }}
                      required
                    />
                  ) : (
                    <TextField
                      id="outlined-basic"
                      label={`Answer ${index + 1}`}
                      variant="outlined"
                      name={`answers.${index}.answer_text`}
                      className={`col-start-1 ${
                        isEssay ? " col-span-6" : " col-span-5"
                      }`}
                      value={answer.answer_text}
                      onChange={(e) => {
                        if (!isTrueOrFalse) {
                          handleChange(e);
                        }
                      }}
                      required
                      multiline
                      minRows={isEnumeration ? 2 : 4}
                      maxRows={isEnumeration ? 2 : 4}
                    />
                  )}
                  {!isEssay && !isEnumeration && (
                    <div className="col-span-1 flex items-center space-x-2">
                      <Checkbox
                        color="success"
                        name={`answers.${index}.is_correct`}
                        checked={answer.is_correct}
                        onChange={handleChange}
                      />
                      {values.answers.length > 1 && !isTrueOrFalse && (
                        <IconButton
                          component="span"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <CloseIcon className="fill-delete" />
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          <div className="col-start-1 col-span-2 ">
            <button
              className="text-xs text-amber-400 font-bold hover:text-orange-600"
              type="button"
              hidden={isHidden}
              onClick={() =>
                arrayHelpers.push({
                  answer_text: "",
                  is_correct: isEnumeration || isEssay,
                })
              }
            >
              ADD MORE ANSWERS
            </button>
          </div>
        </>
      )}
    />
  );
};

interface EditProps {
  question: Question;
  updateQuestionState: (question: Question) => void;
}

const Edit: React.FC<EditProps> = ({ question, updateQuestionState }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const answer = yup.object({
    answer_text: yup.string().required("This is a required field."),
  });

  const validationSchema = yup.object({
    question_text: yup.string().required("This is a required field."),
    question_type: yup.string().required("Select a question type."),
    answers: yup.array().of(answer).min(1, "Must have one answer."),
  });

  return (
    <>
      <Tooltip title="Edit Question">
        <button className="text-amber-400" onClick={handleOpen}>
          <EditIcon />
        </button>
      </Tooltip>

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
            boxShadow: 24,
            p: 4,
          }}
          className="w-full max-w-[674px] flex flex-col divide-y space-y-4 rounded-md overflow-y-scroll max-h-[600px]"
        >
          <div className="flex items-center justify-between text-2xl text-amber-400 font-bold">
            <h5>Update Question</h5>
            <CancelPresentationIcon onClick={handleClose} />
          </div>

          <Formik
            initialValues={{
              answers: question.answers,
              question_text: question.question_text,
              question_type: question.question_type,
              topic_id: question.topic_id,
              image: {
                name: question.image !== "" ? question.image : "",
              } as File,
              score: question.score,
              difficulty: question.difficulty,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              if (values.image.name !== "" && !values.image.name.includes("res.cloudinary.com")) {
                const imageData = new FormData();
                imageData.append("file", values.image);
                imageData.append("upload_preset", "wrqx3e0r");

                const cloudinaryResponse: AxiosResponse<
                  Cloudinary | { message: string }
                > = await axios
                  .post(
                    "https://api.cloudinary.com/v1_1/kaizen-quizbank/image/upload",
                    imageData
                  )
                  .catch((error) => error.response);

                if (cloudinaryResponse.status === 200) {
                  const response = await updateQuestion(question.id, {
                    ...values,
                    image: (cloudinaryResponse.data as Cloudinary).secure_url,
                  });
                  setSubmitting(false);
                  if (response.status === 200) {
                    const question = response.data as Question;
                    updateQuestionState(question);
                    handleClose();
                  }
                }
              } else{
                const response = await updateQuestion(question.id, {
                  ...values,
                  image: values.image.name,
                });
                setSubmitting(false);
                if (response.status === 200) {
                  const question = response.data as Question;
                  updateQuestionState(question);
                  handleClose();
                }
              }
            }}
            validationSchema={validationSchema}
          >
            {({
              isSubmitting,
              values,
              handleChange,
              resetForm,
              setFieldValue,
              dirty,
              errors,
            }) => (
              <Form className="pt-10 grid grid-cols-6 gap-y-6 ">
                <FormControl fullWidth className="col-start-1 col-span-3">
                  <InputLabel id="questionTypeInput">Type</InputLabel>
                  <Select
                    labelId="questionTypeInput"
                    id="demo-simple-select"
                    label="Type"
                    value={values.question_type}
                    name="question_type"
                    onChange={(e) => {
                      if (e.target.value === "true_or_false") {
                        setFieldValue("answers", [
                          { answer_text: "True", is_correct: false },
                          { answer_text: "False", is_correct: false },
                        ]);
                      } else if (
                        e.target.value === "essay" ||
                        e.target.value === "enumeration"
                      ) {
                        setFieldValue("answers", [
                          { answer_text: "", is_correct: true },
                        ]);
                      } else {
                        setFieldValue("answers", [
                          { answer_text: "", is_correct: false },
                        ]);
                      }
                      handleChange(e);
                    }}
                  >
                    <MenuItem value={"true_or_false"}>True or False</MenuItem>
                    <MenuItem value={"multiple_choice"}>
                      Multiple Choice
                    </MenuItem>
                    <MenuItem value={"essay"}>Essay</MenuItem>
                    <MenuItem value={"enumeration"}>Enumeration</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth className="col-start-1 col-span-3">
                  <InputLabel id="diffucltyInput">Difficulty</InputLabel>
                  <Select
                    labelId="diffucltyInput"
                    label="Difficulty"
                    value={values.difficulty}
                    name="difficulty"
                    onChange={handleChange}
                  >
                    <MenuItem value={"easy"}>Easy</MenuItem>
                    <MenuItem value={"medium"}>Medium</MenuItem>
                    <MenuItem value={"hard"}>Hard</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  type="number"
                  label="Score"
                  className="col-end-7 col-span-2"
                  name="score"
                  onChange={handleChange}
                  value={values.score}
                  required
                />

                <Button
                  variant="contained"
                  component="label"
                  className="col-start-1 col-span-3 bg-yellow-600 hover:bg-yellow-500 "
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    name="image"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.target.files) {
                        setFieldValue("image", event.target.files[0]);
                      }
                    }}
                  />
                </Button>

                {values.image && values.image.name && (
                  <div className="flex items-center pl-2 col-span-3 gap-2">
                    
                    <CloseIcon
                      className="fill-delete"
                      onClick={() => {
                        resetForm({
                          values: { ...values, image: { name: "" } as File },
                        });
                      }}
                    />
                    
                  </div>
                )}
                <TextField
                  id="outlined-basic"
                  label="Question"
                  variant="outlined"
                  className="col-start-1 col-span-full"
                  name="question_text"
                  onChange={handleChange}
                  value={values.question_text}
                  required
                  multiline
                  minRows={3}
                  maxRows={3}
                />

                <AnswerField
                  values={values}
                  name={"answers"}
                  handleChange={handleChange}
                />

                <div className="col-span-full flex justify-center space-x-5 text-xs font-bold">
                  <Button
                    variant="contained"
                    className="min-w-[88px] h-[29x] bg-neutral-light-200 text-neutral-light-700 capitalize hover:bg-orange-400 hover:text-white"
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    className="min-w-[88px] h-[29x] bg-neutral-700 hover:bg-neutral-600 capitalize"
                    disabled={isSubmitting || !dirty}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default Edit;
