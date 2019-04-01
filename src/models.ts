export interface ComplianceProduct {
    id: number;
    name: string;
    questionTemplateId: string;
    categories: Category[];
}

export interface Category {
    title: string;
    extendedTitle?: string;
    description: string;
    extendedDescription?: string;
    categoryType: CategoryType;
    questions: Question[];
}

export type Question = SelectQuestion & CountryQuestion & FreeTextQuestion & GroupQuestion;

interface QuestionBase {
    id: string;
    title: string;
    extendedTitle?: string;
    description: string;
    extendedDescription?: string;
    questionType: QuestionType;
}

export interface SelectQuestion extends QuestionBase {
    selectType: SelectQuestionType;
    options: SelectQuestionOption[];
    selectedOptions?: SelectQuestionOption[];
}

export interface CountryQuestion extends QuestionBase {
    selectType: SelectQuestionType;
    options: CountryQuestionOption[];
    selectedOptions: CountryQuestionOption[];
    validationMessage: string;
}

export interface FreeTextQuestion extends QuestionBase {
    maxLength: number;
    isMandatory: boolean;
    answer?: string;
}

export interface GroupQuestion extends QuestionBase {
    maxRepeat: number;
    questions: Question[];
    answers: any[];
}

export interface SelectQuestionOption {
    id: string;
    text: string;
    isComplianceCheckNeeded: boolean;
    followUpQuestions: Question[];
}

export interface CountryQuestionOption {
    id: string;
    text: string;
    validComplianceOption: boolean;
}

enum CategoryType {
    Pep = 0,
    Aml = 1,
}

export enum QuestionType {
    Select = 0,
    FreeText = 1,
    Country = 2,
    Group = 3
}

export enum SelectQuestionType {
    Single = 0,
    Multiple = 1,
}

export type SelectedOption = SelectQuestionOption & CountryQuestionOption;

export interface Answer {
    questionId: string;
    selectedOptions?: SelectedOption[];
    answer?: string;
    answers?: Question[][];
}