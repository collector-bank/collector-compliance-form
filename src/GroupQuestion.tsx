import * as React from 'react';
import { ComplianceFormQuestion } from './FormQuestion';
import { Answer, Question } from './models';
import { answerIsValid } from './validation';
import { TranslationStrings } from '.';
import { isFreeTextQuestion, isSelectQuestion, isCountryQuestion } from './type-guards';

type Item = { [questionId: string]: Question };

interface Props {
    item: Item;
    onUpdate: (item: Item, isValid: boolean) => void;
}

export const groupQuestionFormBuilder = (questions: Question[], disabled: boolean | undefined, translationStrings: TranslationStrings): any => {
    class GroupQuestionForm extends React.Component<Props> {
        private handleAnswer = (answer: Answer) => {
            const question = questions.find(x => x.id === answer.questionId);

            const item: any = {
                ...this.props.item,
                [answer.questionId]: {
                    ...question,
                    ...answer,
                }
            };

            this.props.onUpdate(item, this.isValid(item));
        }

        private isValid = (item: Item) => {
            const answers = Object.keys(item).map(y => item[y]); // "Object.values() polyfill"

            return questions.length === answers.length && answers.every(answerIsValid);
        }

        render() {
            return (
                <>
                    {questions.map(question => {
                        const answer: Partial<Answer> = {};

                        if (this.props.item && question.id in this.props.item) {
                            const q = this.props.item[question.id];

                            if (isFreeTextQuestion(q)) {
                                answer.answer = q.answer;
                            }

                            if (isSelectQuestion(q) || isCountryQuestion(q)) {
                                answer.selectedOptions = q.selectedOptions;
                            }
                        }

                        return (
                            <ComplianceFormQuestion
                                key={question.id}
                                translationStrings={translationStrings}
                                onAnswer={this.handleAnswer}
                                disabled={disabled}
                                {...question}
                                {...answer}
                            />
                        );
                    })}
                </>
            );
        }
    }

    return GroupQuestionForm;
};
