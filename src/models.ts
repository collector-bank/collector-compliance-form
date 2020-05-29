export interface ComplianceProduct {
    id: number;
    name: string;
    questionTemplateId: string;
    categories: Category[];
}

export interface Category {
    title: string;
    extendedTitle?: string | null;
    description: string;
    extendedDescription?: string | null;
    categoryType: CategoryType;
    questions: Question[];
}

export type Question = SelectQuestion | CountryQuestion | FreeTextQuestion | GroupQuestion | BeneficialOwnersQuestion;

interface QuestionBase {
    id: string;
    title: string;
    extendedTitle?: string | null;
    description: string;
    extendedDescription?: string | null;
}

export interface SelectQuestion extends QuestionBase {
    questionType: 0;
    selectType: SelectQuestionType;
    options: SelectQuestionOption[];
    selectedOptions?: SelectQuestionOption[] | null;
}

export interface FreeTextQuestion extends QuestionBase {
    questionType: 1;
    maxLength: number;
    isMandatory: boolean;
    answer?: string | null;
}

export interface CountryQuestion extends QuestionBase {
    questionType: 2;
    selectType: SelectQuestionType;
    options: CountryQuestionOption[];
    selectedOptions: CountryQuestionOption[];
    validationMessage: string;
}

export interface GroupQuestion extends QuestionBase {
    questionType: 3;
    maxRepeat: number;
    questions: Question[];
    answers: Question[][];
}

export interface BeneficialOwnersQuestion extends QuestionBase {
    questionType: 4;
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
    Group = 3,
    BeneficialOwners = 4
}

export enum SelectQuestionType {
    Single = 0,
    Multiple = 1,
}

export type SelectedOption = SelectQuestionOption | CountryQuestionOption;

export interface Answer {
    questionId: string;
    selectedOptions?: SelectedOption[] | null;
    answer?: string | null;
    answers?: Question[][] | null;
}
