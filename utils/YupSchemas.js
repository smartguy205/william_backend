import * as yup from 'yup';

export const userDetailsFormSchema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  phone: yup.string("Invalid phone no").min(8, "Phone number too short.Range between 8 to 20 number").max(20, "Phone number too long.Range between 8 to 20 number").required("Phone no is required"),
  language: yup.string().required("Language is required"),
  position: yup.string().required("Position is required"),
  experience: yup.string().required("Experience is required"),
  file: yup.object().shape({
    name: yup.string().required("File is required"),
    mimetype: yup.string().oneOf(["application/pdf"])
  }).required('File required !!')
});

export const userDetailsFormSchemaWithoutCV = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  phone: yup.string("Invalid phone no").min(8, "Phone number too short.Range between 8 to 20 number").max(20, "Phone number too long.Range between 8 to 20 number").required("Phone no is required"),
  language: yup.string().required("Language is required"),
  position: yup.string().required("Position is required"),
  experience: yup.string().required("Experience is required"),
});


export const questionPaperSchema = yup.object().shape({
  fileObj: yup.array().of(
    yup.object().shape({
      Question: yup.string().required("Question is required"),
      Options: yup.array().required("Options are required"),
      Images: yup.array().nullable(),
      Solution: yup.string().required("Solution is required"),
      Answer: yup.number().required("Answer is required"),
      type: yup.number()
    })
  )
});


export const userTestSchema = yup.object().shape({
  questions: yup.array().of(
    yup.object().shape({
      questionID: yup.string().required("Question cannot be null"),
      answer: yup.string().required("Answer cannot be null")
    }).required("Questions cannot be empty")
  )
})