import * as React from 'react';
import { CheckboxGroup, RadioButtonGroup, Input, Select, Alert, Label } from 'collector-portal-framework/dist/components';
import { Description } from 'collector-portal-framework/dist/common/components/Input/Description';
import { SetHandler } from './SetHandler';
import { Answer, Question, QuestionType, SelectQuestionType, SelectedOption, SelectQuestionOption, CountryQuestionOption } from './models';
import { groupQuestionFormBuilder } from './GroupQuestion';
import { TranslationStrings } from './';
import { isFreeTextQuestion } from './type-guards';

interface Props {
    id: string;
    description?: string;
    extendedDescription?: string | null;
    title: string;
    questionType: QuestionType;
    answer?: string | null;
    answers?: Question[][] | null;
    selectType?: SelectQuestionType;
    options?: SelectedOption[];
    selectedOptions?: SelectedOption[] | null;
    validationMessage?: string;
    maxRepeat?: number;
    maxLength?: number;
    questions?: Question[];
    parameters?: { [key: string]: string };
    onAnswer: (answer: Answer) => void;
    disabled?: boolean;
    translationStrings: TranslationStrings;
}

export class ComplianceFormQuestion extends React.Component<Props> {
    private selectSingleOption = (optionId: string) => {
        const answer = {
            questionId: this.props.id,
            selectedOptions: [this.getOptionById(optionId)],
        };

        this.props.onAnswer(answer);
    };

    private selectMultipleOption = (optionId: string, selected: boolean) => {
        let selectedOptions = this.props.selectedOptions || [];

        if (selected) {
            const option = this.getOptionById(optionId);
            selectedOptions = [...selectedOptions, option];
        } else {
            selectedOptions = selectedOptions.filter(x => x.id !== optionId);
        }

        const answer = {
            questionId: this.props.id,
            selectedOptions,
        };

        this.props.onAnswer(answer);
    };

    private handleFreeText = (event: React.FormEvent<HTMLInputElement>) => {
        const answer = {
            questionId: this.props.id,
            answer: event.currentTarget.value,
        };

        this.props.onAnswer(answer);
    };

    private handleCountrySelect = (event: React.FormEvent<HTMLSelectElement>) => {
        this.selectSingleOption(event.currentTarget.value);
    };

    private getOptionById = (optionId: string) => {
        const options = this.props.options!;
        const option = options.find(x => x.id === optionId);

        return option!;
    };

    private getLabel = () => {
        const { title, description, extendedDescription } = this.props;

        if (description) {
            return `${title} (${description})`;
        } else if (extendedDescription) {
            return (
                <>
                    <span>{title}</span>
                    <Description description={extendedDescription} />
                </>
            );
        } else {
            return title;
        }
    };

    render() {
        const unhandledQuestionType = (type: never): never => {
            throw new Error(`Unhandled question type: ${type}`);
        }

        switch (this.props.questionType) {
            case QuestionType.FreeText:
                return this.renderFreeText();
            case QuestionType.Select:
                return this.renderOptionGroup();
            case QuestionType.Country:
                return this.renderCountrySelector();
            case QuestionType.Group:
                return this.renderGroup();
            case QuestionType.BeneficialOwners:
                return this.renderBeneficialOwners();
            default:
                return unhandledQuestionType(this.props.questionType);
        }
    }

    private changeGroupItems = (items: { [questionId: string]: Question }[][]) => {
        const answer = {
            questionId: this.props.id,
            answers: items.map(this.serializeGroupItems),
        };

        this.props.onAnswer(answer);
    };

    private serializeGroupItems = (items: { [questionId: string]: Question }[]): Question[] => {
        return Object.keys(items).map(y => items[y]); // "Object.values() polyfill"
    };

    private deserializeGroupItems = (items: Question[]): { [questionId: string]: Question }[] => {
        return items.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr }), {});
    };

    private getGroupItemLabel = (item: any, i: number) => {
        if (item) {
            const answers = this.serializeGroupItems(item);
            const firstAnswer = answers[0];

            return isFreeTextQuestion(firstAnswer) && firstAnswer.answer ? firstAnswer.answer : `${i + 1}`;
        }

        return '';
    };

    private renderGroup() {
        const { questions, answers, title, description, disabled, maxRepeat, parameters, translationStrings } = this.props;
        const groupQuestionForm = groupQuestionFormBuilder(questions!, disabled, translationStrings);

        return (
            <>
                <Label>{title}</Label>
                <SetHandler
                    items={answers ? answers.map(this.deserializeGroupItems) : undefined}
                    labelFn={this.getGroupItemLabel}
                    onUpdate={this.changeGroupItems}
                    formComponent={groupQuestionForm}
                    singularLabel={parameters && parameters.subjective ? parameters.subjective : undefined}
                    maxCount={maxRepeat}
                    translationStrings={translationStrings}
                />
                {description && <small>{description}</small>}
            </>
        );
    }

    private renderFreeText() {
        const { answer, disabled, maxLength } = this.props;

        return (
            <Input
                label={this.getLabel()}
                value={answer ? answer : ''}
                maxLength={maxLength ? maxLength : undefined}
                disabled={disabled}
                onChange={this.handleFreeText}
            />
        );
    }

    private renderOptionGroup() {
        const { selectType, disabled, onAnswer, selectedOptions, translationStrings } = this.props;
        const options = this.props.options as SelectQuestionOption[];

        if (!options) {
            return;
        }

        const items = options.map(option => ({
            key: option.id,
            label: option.text,
            child: option.followUpQuestions.map(question => (
                <ComplianceFormQuestion
                    translationStrings={translationStrings}
                    key={question.id}
                    onAnswer={onAnswer}
                    disabled={disabled}
                    {...question}
                />
            )),
        }));

        if (selectType === SelectQuestionType.Single) {
            return (
                <RadioButtonGroup
                    label={this.getLabel()}
                    items={items}
                    selected={selectedOptions && selectedOptions.length > 0 ? selectedOptions[0].id : undefined}
                    disabled={disabled}
                    onChange={this.selectSingleOption}
                />
            );
        } else {
            return (
                <CheckboxGroup
                    label={this.getLabel()}
                    items={items}
                    checked={selectedOptions ? selectedOptions.map(x => x.id) : undefined}
                    disabled={disabled}
                    onChange={this.selectMultipleOption}
                />
            );
        }
    }

    private renderCountrySelector() {
        const { disabled, options, validationMessage } = this.props;
        const selectedOptions = this.props.selectedOptions as CountryQuestionOption[];

        if (!options) {
            return;
        }

        const items = options.map(option => ({
            key: option.id,
            label: option.text,
        }));

        const invalidCountry = selectedOptions && selectedOptions.length > 0 && !selectedOptions[0].validComplianceOption;

        return (
            <div>
                {options.length > 2 ? (
                    <Select
                        label={this.getLabel()}
                        items={items}
                        value={selectedOptions && selectedOptions.length > 0 ? selectedOptions[0].id : undefined}
                        disabled={disabled}
                        onChange={this.handleCountrySelect}
                    />
                ) : (
                    <RadioButtonGroup
                        label={this.getLabel()}
                        items={items}
                        selected={selectedOptions && selectedOptions.length > 0 ? selectedOptions[0].id : undefined}
                        disabled={disabled}
                        onChange={this.selectSingleOption}
                    />
                )}
                {invalidCountry &&
                    <Alert
                        type="warning"
                        message={validationMessage ? validationMessage : this.props.translationStrings.genericError}
                    />
                }
            </div>
        );
    }

    private renderBeneficialOwners() {
        return <Alert type="warning" message="Beneficial Owners Stub"></Alert>
    }
}
