// import { useEffect, useState } from "react";
// import { Button, Input } from "../../components/ui/Input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
// import { Eye, Square, SquareCheck, Trash2 } from "lucide-react";
// import Avatar from "../../components/ui/Avatar";
// import { Link } from "react-router-dom";
// import type { ProfilesStoreShape } from "../../types/models.types";

// const AdminUserManagement = () => {
//   // const dispatch = useAppDispatch();

//   const profilesStore:ProfilesStoreShape = {};
//   const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
//   const [viewProfileState, setViewProfileState] = useState<Profile>(null);
//   const [open, setOpen] = useState(false);
//   const [openConfirmAction, setOpenConfirmAction] = useState(false);
//   const [isAlertConfirmAction, setIsAlertConfirmAction] = useState(false);
//   const [deletedProfiles, setDeletedProfiles] = useState<string[]>([]);

//   const [titleConfirmAction, setTitleConfirmAction] = useState<string>("");
//   const [descriptionConfirmAction, setDescriptionConfirmAction] =
//     useState<React.ReactNode>("");

//   const [isCall, setIsCall] = useState(false);
//   const [search, setSearch] = useState("");

//   // useEffect(() => {
//   //   if (
//   //     !isCall &&
//   //     !profilesStore.pending &&
//   //     profilesStore.value.message === ""
//   //   ) {
//   //     dispatch(profiles());
//   //     setIsCall(true);
//   //   }
//   // }, [isCall, dispatch, profilesStore]);

//   const onClose = () => {
//     setOpen(false);
//     setOpenConfirmAction(false);
//     setTimeout(() => {
//       setIsAlertConfirmAction(false);
//     }, 500);
//     setSelectedProfiles([]);
//   };
//   const onSubmitConfirmActionSubmit = () => {
//     // dispatch(deleteProfile({ id: deletedProfiles }));
//     console.log("Suppression effective")
//     onClose();
//   };
//   const handleSelectProfile = (id: string) => {
//     let profiles = [...selectedProfiles];
//     profiles = !profiles.find((r) => r === id)
//       ? [...selectedProfiles, id]
//       : profiles.filter((r) => r !== id);
//     setSelectedProfiles(profiles);
//   };

//   const handleSelectAllProfiles = () => {
//     if (profilesStore.value.profiles.length !== selectedProfiles.length) {
//       const profiles: string[] = [];
//       profilesStore.value.profiles.forEach((d) => {
//         profiles.push(d.id);
//       });
//       setSelectedProfiles(profiles);
//     } else {
//       setSelectedProfiles([]);
//     }
//   };

//   const handleViewProfile = (profile: Profile = null) => {
//     setViewProfileState(profile);
//     setOpen(true);
//   };

//   const handleDeleteProfile = (profile: Profile = null) => {
//     if (profile.id.length > 0) {
//       setTitleConfirmAction(
//         "Supprimer l'utilisateur " + name + profile.firstname,
//       );
//       setDescriptionConfirmAction(
//         "Voulez-vous vraiment supprimer l'utilisateur " +
//           name +
//           profile.firstname,
//       );
//       setDeletedProfiles([profile.id]);
//       setOpenConfirmAction(true);
//     } else {
//       setIsAlertConfirmAction(true);

//       setTitleConfirmAction("Erreur!");
//       setDescriptionConfirmAction(
//         <>
//           <h2>Erreur lors de la suppression</h2>
//           <span>Une erreur est survenue lors de la suppression.</span>
//           <b>Veuillez réessayer</b>
//         </>,
//       );
//       setOpenConfirmAction(true);
//     }
//   };

//   const handleDeleteProfiles = () => {
//     if (selectedProfiles.length > 0) {
//       setTitleConfirmAction("Supprimer plusieurs utilisateurs");
//       setDescriptionConfirmAction(
//         "Voulez-vous vraiment supprimer tous ces utilisateurs",
//       );
//       setDeletedProfiles(selectedProfiles);
//       setOpenConfirmAction(true);
//     } else {
//       setIsAlertConfirmAction(true);

//       setTitleConfirmAction("Erreur!");
//       setDescriptionConfirmAction(
//         <>
//           <h2>Erreur lors de la suppression</h2>
//           <span>Vous devrez selectionner au moins un utilisateur</span>
//           <b>Veuillez réessayer</b>
//         </>,
//       );
//       setOpenConfirmAction(true);
//     }
//   };
//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Recherche: ", search);
//   };

//   // window.document.title = "Gestion des utilisateurs - ";

//   return (
//     <div className="form-login h-ful mx-auto flex flex-col gap-4 pe-2 overflow-hidden">
//       <legend className="text-center text-xl font-medium mb-2">
//         Gestion des utilisateurs
//       </legend>
//       <div className="w-full flex items-center justify-between">
//         <div className="flex items-center gap-5">
//           <Button className="bg-danger"
//             disabled={selectedProfiles.length === 0}
//             onClick={handleDeleteProfiles}
//           >
//             Delete
//           </Button>
//         </div>
//         <form className="flex items-center gap-5" onSubmit={handleSearch}>
//           <Input
//             type="search"
//             className="w-full"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//             }}
//           />
//           <Button type="submit" className="min-w-fit">
//             Search
//           </Button>
//         </form>
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="text-center mx-auto" align="center">
//               <span
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={handleSelectAllProfiles}
//               >
//                 {selectedProfiles.length ===
//                 profilesStore.value.profiles.length ? (
//                   <SquareCheck />
//                 ) : (
//                   <Square />
//                 )}
//               </span>
//             </TableHead>
//             <TableHead>Profil</TableHead>
//             <TableHead>Names</TableHead>
//             <TableHead>E-mail</TableHead>
//             <TableHead>Numero de telephone</TableHead>
//             <TableHead className="text-center mx-auto" align="center">
//               Actions
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {profilesStore.value?.profiles.map((profile, idx) => (
//             <TableRow key={idx}>
//               <TableCell className="text-center mx-auto" align="center">
//                 {selectedProfiles?.some((s) => s === profile.id) ? (
//                   <SquareCheck
//                     className="cursor-pointer"
//                     onClick={() => handleSelectProfile(profile.id)}
//                   />
//                 ) : (
//                   <Square
//                     className="cursor-pointer"
//                     onClick={() => handleSelectProfile(profile.id)}
//                   />
//                 )}
//               </TableCell>
//               <TableCell>
//                 <Avatar className="size-14 border" size="md" src={profile?.picture} name={profile?.firstname} />
//               </TableCell>
//               <TableCell>
//                 <Link to={`/profile/${profile.id}`} title="Voir le profil">
//                   {profile?.firstname + " " + profile?.lastname}
//                 </Link>
//               </TableCell>
//               <TableCell>{profile?.email}</TableCell>
//               <TableCell>{profile?.phone}</TableCell>
//               <TableCell
//                 className="flex items-center gap-3 justify-center"
//                 align="center"
//               >
//                 <Button
//                 className="bg-info"
//                   onClick={() => handleViewProfile(profile)}
//                 >
//                   <Eye />
//                 </Button>
//                 <Button
//                 className="bg-danger"
//                   onClick={() => handleDeleteProfile(profile)}
//                 >
//                   <Trash2 />
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* <ProfileModal
//         open={open}
//         onClose={onClose}
//         profile={viewProfileState}
//         setProfile={setViewProfileState}
//       />

//       <ConfirmAction
//         open={openConfirmAction}
//         isAlert={isAlertConfirmAction}
//         onClose={onClose}
//         onHandleSubmit={onSubmitConfirmActionSubmit}
//         title={titleConfirmAction}
//         description={descriptionConfirmAction}
//       /> */}
//     </div>
//   );
// };

// export default AdminUserManagement;
