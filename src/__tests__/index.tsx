import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { CollectorPortalFramework } from 'collector-portal-framework';
import { ComplianceForm } from '..';
import privateLoan from './fixtures/private-loan.json';

const translationStrings = {
    genericError: 'genericError',
    genericConfirmationQuestion: 'genericConfirmationQuestion',
    genericConfirmationCancelQuestion: 'genericConfirmationCancelQuestion',
    add: 'add',
    cancel: 'cancel',
    save: 'save',
    edit: 'edit',
    remove: 'remove',
}

afterEach(cleanup);

it('renders without crashing', () => {
    render(
        <CollectorPortalFramework>
            <ComplianceForm
                category={privateLoan}
                onUpdate={() => {}}
                translationStrings={translationStrings}
            />
        </CollectorPortalFramework>
    );
});
