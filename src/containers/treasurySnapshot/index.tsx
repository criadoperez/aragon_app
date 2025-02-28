import React from 'react';
import {ButtonText, ListItemHeader, TransferListItem} from '@aragon/ods-old';
import {Icon, IconType} from '@aragon/ods';

import {useTranslation} from 'react-i18next';
import {generatePath, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {StateEmpty} from 'components/stateEmpty';
import {useGlobalModalContext} from 'context/globalModals';
import {useNetwork} from 'context/network';
import {useTransactionDetailContext} from 'context/transactionDetail';
import {AllTransfers} from 'utils/paths';
import {abbreviateTokenAmount, shortenLongTokenSymbol} from 'utils/tokens';
import {Transfer} from 'utils/types';
import {htmlIn} from 'utils/htmlIn';

type Props = {
  daoAddressOrEns: string;
  transfers: Transfer[];
  totalAssetValue: number;
};

const TreasurySnapshot: React.FC<Props> = ({
  daoAddressOrEns,
  transfers,
  totalAssetValue,
}) => {
  const {t} = useTranslation();
  const {open} = useGlobalModalContext();
  const navigate = useNavigate();
  const {network} = useNetwork();
  const {handleTransferClicked} = useTransactionDetailContext();

  if (transfers.length === 0) {
    return (
      <StateEmpty
        type="both"
        mode="card"
        body={'chart'}
        expression={'excited'}
        hair={'bun'}
        object={'wallet'}
        title={t('finance.emptyState.title')}
        description={htmlIn(t)('finance.emptyState.description')}
        secondaryButton={{
          label: t('finance.emptyState.buttonLabel'),
          onClick: () => open('deposit'),
        }}
        renderHtml
      />
    );
  }

  return (
    <Container>
      <ListItemHeader
        icon={<Icon icon={IconType.APP_FINANCE} />}
        value={new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalAssetValue)}
        label={t('labels.treasuryValue')}
        buttonText={t('allTransfer.newTransfer')}
        orientation="vertical"
        onClick={() => open('transfer')}
      />
      {transfers.slice(0, 3).map(({tokenAmount, tokenSymbol, ...rest}) => (
        <TransferListItem
          key={rest.id}
          tokenAmount={abbreviateTokenAmount(tokenAmount)}
          tokenSymbol={shortenLongTokenSymbol(tokenSymbol)}
          {...rest}
          onClick={() =>
            handleTransferClicked({tokenAmount, tokenSymbol, ...rest})
          }
        />
      ))}
      <ButtonText
        mode="secondary"
        size="large"
        iconRight={<Icon icon={IconType.CHEVRON_RIGHT} />}
        label={t('labels.seeAll')}
        onClick={() =>
          navigate(generatePath(AllTransfers, {network, dao: daoAddressOrEns}))
        }
      />
    </Container>
  );
};

export default TreasurySnapshot;

const Container = styled.div.attrs({
  className: 'space-y-3 xl:space-y-4',
})``;
