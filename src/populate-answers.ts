import {
    Answer,
    CountryQuestion,
    CountryQuestionOption,
    FreeTextQuestion,
    GroupQuestion,
    Question,
    SelectQuestion,
    SelectQuestionOption,
    BeneficialOwnersQuestion
} from './models';

export const populateQuestionWithAnswer = (question: Question, answer: Answer): Question => {
    switch (question.questionType) {
        case 0:
            return populateSelectQuestionWithAnswer(question, answer);
        case 1:
            return populateFreeTextQuestionWithAnswer(question, answer);
        case 2:
            return populateCountryQuestionWithAnswer(question, answer);
        case 3:
            return populateGroupQuestionWithAnswer(question, answer);
        case 4:
            return populateBeneficialOwnersQuestionWithAnswer(question, answer);
    }
};

const populateSelectQuestionWithAnswer = (question: SelectQuestion, answer: Answer) => {
    const populatedQuestion: SelectQuestion = { ...question };

    if (question.id === answer.questionId && answer.selectedOptions != null) {
        populatedQuestion.selectedOptions = <SelectQuestionOption[]>answer.selectedOptions;
    }

    if (populatedQuestion.options) {
        populatedQuestion.options = populatedQuestion.options.map(option => ({
            ...option,
            followUpQuestions: option.followUpQuestions
                ? option.followUpQuestions.map(quest => populateQuestionWithAnswer(quest, answer))
                : [],
        }));
    }

    if (populatedQuestion.selectedOptions) {
        populatedQuestion.selectedOptions = populatedQuestion.selectedOptions.map(option => ({
            ...option,
            followUpQuestions: option.followUpQuestions
                ? option.followUpQuestions.map(quest => populateQuestionWithAnswer(quest, answer))
                : [],
        }));
    }

    return populatedQuestion;
};

const populateCountryQuestionWithAnswer = (question: CountryQuestion, answer: Answer) => {
    const populatedQuestion: CountryQuestion = { ...question };

    if (question.id === answer.questionId && answer.selectedOptions != null) {
        populatedQuestion.selectedOptions = <CountryQuestionOption[]>answer.selectedOptions;
    }

    return populatedQuestion;
};

const populateFreeTextQuestionWithAnswer = (question: FreeTextQuestion, answer: Answer) => {
    return question.id === answer.questionId
        ? { ...question, ...answer }
        : question;
};

const populateGroupQuestionWithAnswer = (question: GroupQuestion, answer: Answer) => {
    const populatedQuestion: Question = { ...question };

    if (question.id === answer.questionId && answer.answers != null) {
        populatedQuestion.answers = answer.answers;
    }

    if (populatedQuestion.questions) {
        populatedQuestion.questions = populatedQuestion.questions.map(quest => populateQuestionWithAnswer(quest, answer));
    }

    return populatedQuestion;
};

const populateBeneficialOwnersQuestionWithAnswer = (question: BeneficialOwnersQuestion, answer: Answer) => {
    return question.id === answer.questionId
        ? { ...question, ...answer }
        : question;
};
