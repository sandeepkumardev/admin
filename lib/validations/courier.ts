import { z } from "zod";

export const courierListQuerySchema = z.object({
  p_pin: z.string().nonempty(),
  d_pin: z.string().nonempty(),
  dm: z.string().nonempty(),
  pm: z.string().nonempty(),
  sv: z.string().nonempty(),
  w: z.string().nonempty(),
  bl: z.string().nonempty(),
  bw: z.string().nonempty(),
  bh: z.string().nonempty(),
});
