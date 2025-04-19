import { z } from "zod";
import { Pagination } from "./response";

export enum ArtistRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const artistRequestSchema = z.object({
  _id: z.string(),
  id: z.string(),
  name: z.string(),
  dob: z.string(),
  sex: z.string(),
  nationality: z.string(),
  home: z.string(),
  address: z.string(),
  doe: z.string(),
  issue_date: z.string(),
  issue_loc: z.string(),
  features: z.string(),
  mrz: z.string(),
  imageFront: z.string(),
  imageBack: z.string(),
  status: z.nativeEnum(ArtistRequestStatus).default(ArtistRequestStatus.PENDING),
  user: z.object({
    _id: z.string()
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  rejectionReason: z.string().optional()
});

export type ArtistRequest = z.infer<typeof artistRequestSchema>;

export type GetArtistRequestsResponse = {
  cccd: ArtistRequest[];
  pagination: Pagination;
};

export type ArtistRequestResponse = {
  request: ArtistRequest;
};