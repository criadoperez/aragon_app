import React from 'react';
import {useTranslation} from 'react-i18next';
import {ButtonText} from '@aragon/ods-old';
import {Icon, IconType} from '@aragon/ods';
import styled from 'styled-components';
import {useGlobalModalContext} from 'context/globalModals';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';

const PoapClaimModal: React.FC = () => {
  const {t} = useTranslation();
  const {isOpen, close} = useGlobalModalContext('poapClaim');

  return (
    <ModalBottomSheetSwitcher
      isOpen={isOpen}
      onClose={close}
      title={t('modal.claimPoap.title')}
    >
      <Container>
        <BodyWrapper>
          <PoapImgContainer>
            <PoapImg
              src="https://assets.poap.xyz/aragon-dao-builder-2023-logo-1678314360270.png"
              alt=""
            />
          </PoapImgContainer>

          <ButtonText
            mode="primary"
            size="large"
            label={t('modal.claimPoap.ctaLabel')}
            className="w-full"
            iconRight={<Icon icon={IconType.LINK_EXTERNAL} />}
            onClick={() => {
              window.open(t('modal.claimPoap.ctaURL'), '_blank');
              close();
            }}
          />
        </BodyWrapper>
      </Container>
    </ModalBottomSheetSwitcher>
  );
};

const Container = styled.div.attrs({
  className: 'p-6',
})``;

const PoapImgContainer = styled.div.attrs({
  className: 'py-6 flex justify-center',
})``;

const PoapImg = styled.img.attrs({
  className: 'w-full h-full',
})`
  max-width: 280px;
  max-height: 280px;
`;

const BodyWrapper = styled.div.attrs({
  className: 'space-y-6',
})``;

export default PoapClaimModal;
