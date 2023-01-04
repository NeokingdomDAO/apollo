type OdooEmployee = {
  id: string;
  user_id: [number, string];
  display_name: string;
  work_email: string;
  ethereum_address: string;
};

export function parseEmployee(user: OdooEmployee) {
  return {
    id: user.id,
    name: user.display_name,
    userId: user.user_id[0],
    email: user.work_email,
    ethereumAddress: user.ethereum_address,
    profilePicture: `https://odoo.neokingdom.org/web/image?model=hr.employee&id=${user.user_id[0]}&field=image_1024`,
  };
}
