import { Asset } from "@clearblade/ia-mfe-core";
import { UseQueryResult } from "react-query";
export declare const assetsQueryKeys: {
    all: readonly [{
        readonly scope: "assets";
    }];
};
export declare function useAssetsQuery<TData = Asset["frontend"][]>({ select, }?: {
    select?: (data: Asset["frontend"][]) => TData;
}): UseQueryResult<TData | {
    id: string;
    owners: string[];
    latitude: number | null;
    longitude: number | null;
    type: string;
    label: string;
    description: string;
    image: string;
    last_updated: string | null;
    location_updated: string | null;
    custom_data: {
        [x: string]: string | number | boolean | null | undefined;
        [x: number]: string | number | boolean | null | undefined;
        [x: symbol]: string | number | boolean | null | undefined;
    };
    attributes_last_updated: {
        [x: string]: string | undefined;
        [x: number]: string | undefined;
        [x: symbol]: string | undefined;
    } | null;
    parent: string;
    location_x: number | null;
    location_y: number | null;
    location_z: number | null;
    location_type: string;
    location_unit: string;
    custom_id_1: string;
    custom_id_2: string;
    last_location_updated: string | null;
    group_id: string;
    tree_id: string;
    is_root: boolean;
    group_ids: string[];
    item_id: string;
}[], unknown>;
export declare function useAsset<TAssetShape extends Asset["frontend"]>(assetId: string): UseQueryResult<TAssetShape>;
