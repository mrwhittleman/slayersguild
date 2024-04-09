import { useWalletName } from "@/hooks/useWalletName";
import { useWallet } from "@vechain/dapp-kit-react";
import { useNftList } from "@/hooks/useNftList";
import Spinner from "@/components/Spinner";
import SlayerCardComponent from "@/components/SlayerCardComponent";
import { NftListType } from "@/types/types";
import { Grid, GridContent, GridGallery } from "@/components/ui/grid";

const MySlayerPage = () => {
  const wallet = useWallet();
  const { name } = useWalletName(wallet.account);
  const { balance, isLoading, tokens } = useNftList(wallet.account);

  if (!wallet.account) {
    return (
      <div className="flex flex-col w-full items-center gap-4">
        <h3 className="text-2xl text-center">
          Please connect with your Vechain wallet to see your Slayer collection.
        </h3>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-end gap-4">
        <h3 className="text-4xl">Skol,</h3>
        <p className="text-4xl text-tertiary-foreground">
          {name
            ? name.length <= 8
              ? name.replace(".vet", " .vet")
              : name
            : wallet.account}
        </p>
      </div>
      <div className="flex h-full w-full flex-col gap-8">
        <p className="flex gap-1">
          You currently own{" "}
          {isLoading ? <Spinner className="w-3 h-3 self-center" /> : balance}{" "}
          Slayer!
        </p>
        {isLoading ? (
          <div className="flex w-full h-full justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <Grid className="grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-y lg:divide-y-0">
            <GridContent className="pr-0 lg:pr-8 pb-8 lg:pb-0">
              <GridGallery>
                {tokens.map((token, idx) => {
                  const slayer = {
                    tokenId: token.tokenId,
                    owner: wallet.account,
                  } as NftListType;

                  return (
                    <SlayerCardComponent
                      key={`${token.tokenId}-gallery-${idx}`}
                      slayer={slayer}
                      type="link"
                      className="cursor-pointer outline-4 hover:outline"
                    />
                  );
                })}
              </GridGallery>
            </GridContent>
            <GridContent className="flex-col gap-4 items-center lg:items-start pl-0 lg:pl-8 pt-8 lg:pt-0">
              <p className="max-w-md">
                In the realm of Eldoria, 666 fierce warriors known as Slayers,
                inspired by Nordic mythology, rose to confront the spreading
                chaos caused by the proliferation of X-Nodes. These Slayers,
                clad in rugged armor and wielding ancient weapons, embarked on a
                perilous quest led by High Chief Ragnar Stormheart. Along their
                journey, they battled monsters and confronted dark forces,
                forging bonds of brotherhood amidst the crucible of battle.
                <br />
                <br />
                Their ultimate adversary was the Archon of the X-Nodes, a
                powerful entity threatening to engulf Eldoria in darkness. In a
                climactic showdown, the Slayers vanquished the Archon and
                destroyed the X-Nodes, restoring peace to their land. Though
                their quest was over, the Slayers remained vigilant, ready to
                face new threats and protect Eldoria from the shadows that
                lurked beyond.
              </p>
              <h1>Soon&trade;</h1>
            </GridContent>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MySlayerPage;
