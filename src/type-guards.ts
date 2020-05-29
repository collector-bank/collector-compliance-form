import { Question, QuestionType, SelectQuestion, FreeTextQuestion, CountryQuestion, GroupQuestion, BeneficialOwnersQuestion } from './models';

export const isSelectQuestion = (question: Question): question is SelectQuestion =>
    question.questionType === QuestionType.Select;

export const isFreeTextQuestion = (question: Question): question is FreeTextQuestion =>
    question.questionType === QuestionType.FreeText;

export const isCountryQuestion = (question: Question): question is CountryQuestion =>
    question.questionType === QuestionType.Country;

export const isGroupQuestion = (question: Question): question is GroupQuestion =>
    question.questionType === QuestionType.Group;

export const isBeneficialOwnersQuestion = (question: Question): question is BeneficialOwnersQuestion =>
    question.questionType === QuestionType.BeneficialOwners;
