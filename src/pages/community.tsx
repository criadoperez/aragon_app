import React, {useCallback, useState} from 'react';
import {
  Pagination,
  SearchInput,
  IllustrationHuman,
  Dropdown,
  ButtonText,
  ListItemAction,
} from '@aragon/ods-old';
import {Icon, IconType} from '@aragon/ods';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {MembersList} from 'components/membersList';
import {StateEmpty} from 'components/stateEmpty';
import {Loading} from 'components/temporary';
import {PageWrapper} from 'components/wrappers';
import {useNetwork} from 'context/network';
import {useDaoDetailsQuery} from 'hooks/useDaoDetails';
import {useDaoMembers} from 'hooks/useDaoMembers';
import {useDebouncedState} from 'hooks/useDebouncedState';
import {PluginTypes} from 'hooks/usePluginClient';
import {CHAIN_METADATA} from 'utils/constants';
import PageEmptyState from 'containers/pageEmptyState';
import {htmlIn} from 'utils/htmlIn';
import useScreen from 'hooks/useScreen';
import {useGovTokensWrapping} from 'context/govTokensWrapping';
import {useExistingToken} from 'hooks/useExistingToken';
import {Erc20WrapperTokenDetails} from '@aragon/sdk-client';
import {featureFlags} from 'utils/featureFlags';
import {useGlobalModalContext} from 'context/globalModals';

const MEMBERS_PER_PAGE = 20;

export const Community: React.FC = () => {
  const {t} = useTranslation();
  const {network} = useNetwork();
  const navigate = useNavigate();
  const {isMobile} = useScreen();
  const {open} = useGlobalModalContext();
  const {handleOpenModal} = useGovTokensWrapping();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'votingPower' | 'delegations'>(
    'votingPower'
  );
  const [debouncedTerm, searchTerm, setSearchTerm] = useDebouncedState('');

  const {data: daoDetails, isLoading: detailsAreLoading} = useDaoDetailsQuery();

  const apiPage = Math.floor(((page - 1) / 1000) * MEMBERS_PER_PAGE);
  const {
    data: {members, filteredMembers, daoToken, memberCount: totalMemberCount},
    isLoading: membersLoading,
  } = useDaoMembers(
    daoDetails?.plugins[0].instanceAddress as string,
    daoDetails?.plugins[0].id as PluginTypes,
    {
      searchTerm: debouncedTerm,
      sort,
      page: apiPage,
    }
  );

  const {isDAOTokenWrapped, isTokenMintable} = useExistingToken({
    daoToken,
    daoDetails,
  });

  const filteredMemberCount = filteredMembers.length;

  const showFiltered =
    filteredMemberCount > 0 &&
    filteredMemberCount < members.length &&
    apiPage === 0;
  const displayedMembers = showFiltered ? filteredMembers : members;
  const displayedMembersTotal = showFiltered
    ? filteredMemberCount
    : totalMemberCount;
  const subpageStart = (page - 1) * MEMBERS_PER_PAGE - apiPage * 1000;
  const pagedMembers = displayedMembers.slice(
    subpageStart,
    subpageStart + MEMBERS_PER_PAGE
  );

  const walletBased =
    (daoDetails?.plugins[0].id as PluginTypes) === 'multisig.plugin.dao.eth';
  const enableSearchSort = totalMemberCount <= 1000;
  const enableDelegation =
    featureFlags.getValue('VITE_FEATURE_FLAG_DELEGATION') === 'true';

  const sortLabel = isMobile
    ? ''
    : sort === 'delegations'
    ? t('community.sortByDelegations.selected')
    : t('community.sortByVotingPower.selected');

  /*************************************************
   *                    Handlers                   *
   *************************************************/
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.trim());
  };

  const navigateToTokenHoldersChart = () => {
    window.open(
      CHAIN_METADATA[network].explorer +
        '/token/tokenholderchart/' +
        daoToken?.address,
      '_blank'
    );
  };

  const handleSecondaryButtonClick = () => {
    if (isTokenMintable) {
      navigate('mint-tokens');
    } else navigateToTokenHoldersChart();
  };

  const handlePrimaryClick = () => {
    if (walletBased) {
      navigate('manage-members');
    } else if (isDAOTokenWrapped) {
      handleOpenModal();
    } else if (isTokenMintable) {
      open('delegateVoting');
    }
  };

  const handlePageChange = useCallback((activePage: number) => {
    setPage(activePage);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  /*************************************************
   *                     Render                    *
   *************************************************/
  if (detailsAreLoading || membersLoading) return <Loading />;

  if (!totalMemberCount && isDAOTokenWrapped) {
    return (
      <PageEmptyState
        title={t('community.emptyState.title')}
        subtitle={htmlIn(t)('community.emptyState.desc', {
          tokenSymbol:
            (daoToken as Erc20WrapperTokenDetails)?.underlyingToken?.symbol ||
            daoToken?.symbol,
        })}
        Illustration={
          <div className="flex">
            <IllustrationHuman
              {...{
                body: 'elevating',
                expression: 'smile_wink',
                hair: 'middle',
                sunglass: 'big_rounded',
                accessory: 'buddha',
              }}
              {...(isMobile
                ? {height: 165, width: 295}
                : {height: 225, width: 400})}
            />
          </div>
        }
        primaryButton={{
          label: t('community.emptyState.ctaLabel'),
          onClick: handleOpenModal,
        }}
      />
    );
  }

  return (
    <PageWrapper
      title={`${totalMemberCount} ${t('labels.members')}`}
      {...(walletBased
        ? {
            description: t('explore.explorer.walletBased'),
            primaryBtnProps: {
              label: t('labels.manageMember'),
              onClick: handlePrimaryClick,
            },
          }
        : isDAOTokenWrapped
        ? {
            description: t('explore.explorer.tokenBased'),
            primaryBtnProps: {
              label: t('governance.actionSecondary'),
              iconLeft: <Icon icon={IconType.TX_FAILURE} />,
              onClick: () => open('delegateVoting'),
            },
            secondaryBtnProps: {
              label: t('community.ctaMain.wrappedLabel'),
              onClick: handlePrimaryClick,
            },
            tertiaryBtnProps: {
              label: t('labels.seeAllHolders'),
              iconLeft: <Icon icon={IconType.LINK_EXTERNAL} />,
              onClick: handleSecondaryButtonClick,
            },
          }
        : isTokenMintable
        ? {
            description: t('explore.explorer.tokenBased'),
            primaryBtnProps: {
              label: t('governance.actionSecondary'),
              iconLeft: <Icon icon={IconType.TX_FAILURE} />,
              onClick: handlePrimaryClick,
            },
            secondaryBtnProps: {
              label: t('labels.mintTokens'),
              iconLeft: <Icon icon={IconType.ADD} />,
              onClick: handleSecondaryButtonClick,
            },
            tertiaryBtnProps: {
              label: t('labels.seeAllHolders'),
              iconLeft: <Icon icon={IconType.LINK_EXTERNAL} />,
              onClick: navigateToTokenHoldersChart,
            },
          }
        : {
            description: t('explore.explorer.tokenBased'),
            primaryBtnProps: {
              label: t('governance.actionSecondary'),
              iconLeft: <Icon icon={IconType.TX_FAILURE} />,
              onClick: () => open('delegateVoting'),
            },
            secondaryBtnProps: {
              label: t('labels.seeAllHolders'),
              iconLeft: <Icon icon={IconType.LINK_EXTERNAL} />,
              onClick: handleSecondaryButtonClick,
            },
          })}
    >
      <BodyContainer>
        <SearchAndResultWrapper>
          <div className="flex flex-row gap-4 xl:gap-8">
            {enableSearchSort && (
              <SearchInput
                placeholder={t('labels.searchPlaceholder')}
                containerClassName="grow"
                value={searchTerm}
                onChange={handleQueryChange}
              />
            )}
            {!walletBased && enableSearchSort && enableDelegation && (
              <Dropdown
                align="end"
                className="p-2"
                style={{minWidth: 'var(--radix-dropdown-menu-trigger-width)'}}
                sideOffset={8}
                listItems={[
                  {
                    callback: () => setSort('votingPower'),
                    component: (
                      <ListItemAction
                        title={t('community.sortByVotingPower.default')}
                        bgWhite={true}
                        mode={sort === 'votingPower' ? 'selected' : 'default'}
                        iconRight={
                          sort === 'votingPower' ? (
                            <Icon icon={IconType.CHECKMARK} />
                          ) : undefined
                        }
                      />
                    ),
                  },
                  {
                    callback: () => setSort('delegations'),
                    component: (
                      <ListItemAction
                        title={t('community.sortByDelegations.default')}
                        bgWhite={true}
                        mode={sort === 'delegations' ? 'selected' : 'default'}
                        iconRight={
                          sort === 'delegations' ? (
                            <Icon icon={IconType.CHECKMARK} />
                          ) : undefined
                        }
                      />
                    ),
                  },
                ]}
                side="bottom"
                trigger={
                  <ButtonText
                    mode="secondary"
                    iconLeft={<Icon icon={IconType.SORT} />}
                    size="large"
                    label={sortLabel}
                  />
                }
              />
            )}
          </div>

          {/* Members List */}
          {membersLoading ? (
            <Loading />
          ) : (
            <>
              {debouncedTerm !== '' && !filteredMemberCount ? (
                <StateEmpty
                  type="Object"
                  mode="inline"
                  object="magnifying_glass"
                  title={t('labels.noResults')}
                  description={t('labels.noResultsSubtitle')}
                />
              ) : (
                <>
                  {debouncedTerm !== '' && !membersLoading && (
                    <ResultsCountLabel>
                      {filteredMemberCount === 1
                        ? t('labels.result')
                        : t('labels.nResults', {count: filteredMemberCount})}
                    </ResultsCountLabel>
                  )}
                  <MembersList token={daoToken} members={pagedMembers} />
                </>
              )}
            </>
          )}
        </SearchAndResultWrapper>

        {/* Pagination */}
        <PaginationWrapper>
          {displayedMembersTotal > MEMBERS_PER_PAGE && (
            <Pagination
              totalPages={
                Math.ceil(displayedMembersTotal / MEMBERS_PER_PAGE) as number
              }
              activePage={page}
              onChange={handlePageChange}
            />
          )}
        </PaginationWrapper>
      </BodyContainer>
    </PageWrapper>
  );
};

const BodyContainer = styled.div.attrs({
  className: 'mt-2 xl:space-y-16',
})``;

const SearchAndResultWrapper = styled.div.attrs({className: 'space-y-10'})``;

const ResultsCountLabel = styled.p.attrs({
  className: 'font-semibold text-neutral-800 ft-text-lg',
})``;

const PaginationWrapper = styled.div.attrs({
  className: 'flex mt-16',
})``;
