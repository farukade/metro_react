import { useCallback, useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { startCase } from "lodash";
import {
  bootstrapColors,
  getRandomNumber,
  request,
  uploadRequest,
} from "../../auth/core/_requests";
import { ConfirmationType } from "../../../../_metronic/layout/core";
import ConfirmationModal from "../../../../_metronic/partials/modals/confirmation/Confirmation";
import { KTIcon } from "../../../../_metronic/helpers";

const API_URL = import.meta.env.VITE_APP_API_URL;

interface AddContact {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  emailTwo: string;
  phone: string;
  phoneTwo: string;
  description: string;
}

const defaultNewContact = {
  firstName: "",
  lastName: "",
  email: "",
  emailTwo: "",
  phone: "",
  phoneTwo: "",
  description: "",
  image: "",
};

export function Overview() {
  const [contactGroups, setContactGroups] = useState<any>([]);
  const [group, setGroup] = useState<any>(null);
  const [newGroup, setNewGroup] = useState<string>("");
  const [contacts, setContacts] = useState<any>([]);
  const [contact, setContact] = useState<any>(null);
  const [groupError, setGroupError] = useState<string>("");
  const [contactError, setContactError] = useState<string>("");
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [contactData, setContactData] = useState<AddContact>(defaultNewContact);
  const [confirmation, setConfirmation] = useState<ConfirmationType | null>(
    null
  );

  const getGroups = useCallback(async () => {
    try {
      const url = "group";
      const rs = await request(url, "GET", true);
      if (rs.success) {
        if (rs.result?.length) {
          setContactGroups(rs.result);
          setGroup(rs.result[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getContacts = useCallback(async () => {
    try {
      const url = `contact?key=${key}&limit=200`;
      const rs = await request(url, "GET", true);
      if (rs.success) {
        if (rs.result) {
          setContacts(rs.result);
          setContactOpen(true);
          if (!contact) {
            setContact(rs.result[0]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  const saveGroup = async () => {
    try {
      const url = "group";
      if (!newGroup || newGroup === "") {
        setGroupError("Group name is required!");
        return;
      }

      const datum = { name: newGroup };
      const rs = await request(url, "POST", true, datum);
      if (rs.success) {
        setContactGroups([rs.result, ...contactGroups]);
        setContact(rs.result[0]);
        setNewGroup("");
        setContactError("");
        setGroupError("");
      } else {
        setGroupError(rs.message || "Error saving group!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async () => {
    try {
      const url = `contact?id=${contact.id}`;

      const rs = await request(url, "DELETE", true);
      if (rs.success) {
        const newItems = contacts?.filter((c: any) => c.id !== contact.id);
        setContact(newItems?.length ? newItems[0] : null);
        setContacts(newItems);
        setNewGroup("");
        setContactError("");
        setGroupError("");
      } else {
        setContactError(rs.message || "Error saving group!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveContact = async () => {
    try {
      setContactError("");
      const url = editing ? `contact?id=${contact.id}` : "contact";
      const method = editing ? "PUT" : "POST";
      const {
        image,
        lastName,
        firstName,
        email,
        emailTwo,
        phoneTwo,
        phone,
        description,
      } = contactData;

      if (!firstName) {
        setContactError("First name is required!");
        return;
      }
      if (!lastName) {
        setContactError("Last name is required!");
        return;
      }
      if (!email) {
        setContactError("Email name is required!");
        return;
      }
      if (email.split("@").length < 2) {
        setContactError("Email not valid!");
        return;
      }
      if (!phone) {
        setContactError("Phone name is required!");
        return;
      }
      setContactError("");
      const datum = editing
        ? {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            image,
            description,
            emailTwo,
            phoneTwo,
          }
        : {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            image: image || null,
            description: description || null,
            emailTwo: emailTwo || null,
            phoneTwo: phoneTwo || null,
          };
      const rs = await request(url, method, true, datum);
      if (rs.success) {
        if (editing) {
          const otherContacts = contacts.filter(
            (c: any) => c.id !== contact.id
          );
          setContacts([rs.result, ...otherContacts]);
        } else {
          setContacts([rs.result, ...contacts]);
        }
        setContact(rs.result);
        setNewGroup("");
        setContactOpen(true);
        setContactError("");
        setGroupError("");
        setEditing(false);
      } else {
        setContactError(rs.message || "Error saving group!");
      }
    } catch (error: any) {
      setContactError(error.message || "Error saving group!");
      console.log(error);
    }
  };

  const uploadImage = async (file: any) => {
    try {
      const url = "upload";
      const fd = new FormData();
      fd.append("file", file);
      const rs = await uploadRequest(url, "POST", fd);
      const { data } = rs;
      if (data.success) {
        setContactData({
          ...contactData,
          image: data.result.url,
        });
        setContactError("");
        setGroupError("");
      } else {
        setContactError(data.message || "Image upload error!");
      }
    } catch (error: any) {
      setContactError(error?.message || "Upload error!");
      console.log(error);
    }
  };

  const getNameAbbr = (item: string) => {
    if (item) {
      const namesArr = item.split(" ");
      let result = "";
      for (const name of namesArr) {
        result += name[0].toUpperCase();
      }
      return result;
    } else {
      return "";
    }
  };

  const getFirstNameLastName = (item: any) => {
    const nameArr = item.name?.split(" ");
    let firstName: string = "";
    let lastName: string = "";
    let i = 0;
    for (const item of nameArr) {
      if (i > 1) {
        lastName += ` ${item}`;
      } else if (i === 1) {
        lastName += `${item}`;
      } else {
        firstName += item;
      }
      i++;
    }
    return { firstName, lastName };
  };

  useEffect(() => {
    getGroups();
    getContacts();
  }, [getGroups, getContacts]);

  return (
    <Content>
      <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-5">
        <li className="breadcrumb-item text-muted">
          <a
            className="text-muted text-hover-primary"
            href="/crafted/account/overview"
          >
            Contacts
          </a>
        </li>
        <li className="breadcrumb-item text-gray-900"></li>
      </ul>
      <div className="d-flex align-items-center gap-2 gap-lg-3"></div>
      <div className="row g-7">
        <div className="col-lg-6 col-xl-3">
          <div className="card card-flush">
            <div className="card-header pt-7" id="kt_chat_contacts_header">
              <div className="card-title">
                <h2>Groups</h2>
              </div>
            </div>

            <div className="card-body pt-5">
              {groupError && groupError !== "" && (
                <div
                  className="alert alert-danger"
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Error!</strong> ${groupError}`,
                  }}
                />
              )}
              <div className="d-flex flex-column gap-5">
                {contactGroups?.map((g: any, i: number) => {
                  return (
                    <div className="d-flex flex-stack" key={i}>
                      <a
                        // href="/metronic8/demo1/apps/contacts/getting-started.html"
                        className="fs-6 fw-bold text-gray-800 text-hover-primary text-active-primary active"
                      >
                        {g.name}
                      </a>
                      <div
                        className={`badge ${
                          g.count ? "badge-light-primary" : "badge-light-danger"
                        }`}
                      >
                        {g.count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="separator my-7"></div>

              <label className="fs-6 fw-semibold form-label">
                Add new group
              </label>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Group name"
                  value={newGroup}
                  onChange={(e) => {
                    setNewGroup(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-icon btn-light"
                  onClick={() => {
                    saveGroup();
                  }}
                >
                  <i className="ki-duotone ki-plus-square fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>{" "}
                </button>
              </div>

              <div className="separator my-7"></div>

              <a
                onClick={() => {
                  setContactOpen(false);
                  setContactData({
                    ...defaultNewContact,
                  });
                  setEditing(false);
                }}
                className="btn btn-primary w-100"
              >
                <i className="ki-duotone ki-badge fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                  <span className="path5"></span>
                </i>{" "}
                Add new contact
              </a>
            </div>
          </div>
        </div>
        <div
          className={`col-lg-6 ${
            contact && contactOpen ? "col-xl-4" : "col-xl-3"
          }`}
        >
          <div className="card card-flush" id="kt_contacts_list">
            <div className="card-header pt-7" id="kt_contacts_list_header">
              <form className="d-flex align-items-center position-relative w-100 m-0">
                <i className="ki-duotone ki-magnifier fs-3 text-gray-500 position-absolute top-50 ms-5 translate-middle-y">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>

                <input
                  type="text"
                  className="form-control form-control-solid ps-13"
                  name="Search contacts"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                  }}
                  placeholder="Search contacts"
                />
              </form>
            </div>
            <div className="card-body pt-5" id="kt_contacts_list_body">
              <div
                className="scroll-y me-n5 pe-5 h-300px h-xl-auto"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_contacts_list_header"
                data-kt-scroll-wrappers="#kt_content, #kt_contacts_list_body"
                data-kt-scroll-stretch="#kt_contacts_list, #kt_contacts_main"
                data-kt-scroll-offset="5px"
                style={{ maxHeight: "755px" }}
              >
                {contacts?.map((c: any, i: number) => {
                  const cIndex = getRandomNumber(0, 4);
                  const color = bootstrapColors[cIndex];
                  return (
                    <div key={i}>
                      <div
                        className="d-flex flex-stack py-4 "
                        style={{ width: "100%" }}
                      >
                        <div
                          className="d-flex align-items-between justify-content-between"
                          style={{ width: "100%" }}
                        >
                          <div style={{ display: "flex" }}>
                            <div className="symbol  symbol-40px symbol-circle ">
                              {c.image === "placeholder.jpg" ||
                              c.image === "" ||
                              !c.image ? (
                                <span
                                  className={`symbol-label  bg-light-${color} text-${color} fs-6 fw-bolder `}
                                >
                                  {getNameAbbr(c.name)}
                                </span>
                              ) : (
                                <img alt="Pic" src={`${API_URL}/${c.image}`} />
                              )}
                            </div>

                            <div className="ms-4">
                              <a
                                onClick={() => {
                                  setContact(c);
                                  setContactOpen(true);
                                }}
                                style={{ cursor: "pointer" }}
                                className={`fs-6 fw-bold text-gray-900 text-hover-${color} mb-2`}
                              >
                                {startCase(c.name)}
                              </a>
                              <div className="fw-semibold fs-7 text-muted">
                                {c.email?.toLowerCase()}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end flex-shrink-0">
                            <a
                              href="#"
                              className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                              onClick={() => {
                                setConfirmation({
                                  message:
                                    "Are you sure you want to delete this transaction?",
                                  action: () => {
                                    setContact(c);
                                    deleteContact();
                                  },
                                  close: () => {
                                    setConfirmation(null);
                                  },
                                });
                              }}
                            >
                              <KTIcon iconName="trash" className="fs-3" />
                            </a>
                            <a
                              href="#"
                              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                              onClick={() => {
                                setContact(c);
                                setEditing(true);
                                setContactOpen(false);
                                setContactData({
                                  ...c,
                                  ...getFirstNameLastName(c),
                                });
                              }}
                            >
                              <KTIcon iconName="pencil" className="fs-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="separator separator-dashed d-none"></div>
                    </div>
                  );
                })}
                {!contacts?.length && (
                  <div>
                    <div className="d-flex flex-stack py-4">
                      <div className="d-flex align-items-center">
                        <div className="ms-4">
                          <div className="fw-semibold fs-7 text-muted">
                            No Contacts
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="separator separator-dashed d-none"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {contact && contactOpen ? (
          <div className="col-xl-5">
            {contactError && contactError !== "" && (
              <div
                className="alert alert-danger"
                dangerouslySetInnerHTML={{
                  __html: `<strong>Error!</strong> ${contactError}`,
                }}
              />
            )}
            <div className="card card-flush h-lg-100" id="kt_contacts_main">
              <div className="card-header pt-7" id="kt_chat_contacts_header">
                <div className="card-title">
                  <i className="ki-duotone ki-badge fs-1 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>{" "}
                  <h2>Contact Details</h2>
                </div>

                <div className="card-toolbar gap-3">
                  <a
                    // href="#"
                    className="btn btn-sm btn-icon btn-light btn-active-light-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                  >
                    <i className="ki-duotone ki-dots-square fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                    </i>{" "}
                  </a>

                  <div
                    className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                    data-kt-menu="true"
                  >
                    <div className="menu-item px-3">
                      <a
                        onClick={() => {
                          setContactData({
                            ...contact,
                            ...getFirstNameLastName(contact),
                          });
                          setContactOpen(false);
                          setEditing(true);
                        }}
                        className="menu-link px-3"
                      >
                        Edit
                      </a>
                    </div>

                    <div className="menu-item px-3">
                      <a
                        // href="#"
                        className="menu-link px-3"
                        id="kt_contact_delete"
                        onClick={() => {
                          setConfirmation({
                            message: "Are you sure you want to delete contact?",
                            action: () => deleteContact(),
                            close: () => setConfirmation(null),
                          });
                        }}
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body pt-5">
                <div className="d-flex gap-7 align-items-center">
                  <div className="symbol symbol-circle symbol-100px">
                    {contact.image ? (
                      <img src={`${API_URL}/${contact.image}`} alt="image" />
                    ) : (
                      <span
                        className={`symbol-label  bg-light-dark text-dark fw-bolder`}
                        style={{ fontSize: "30px" }}
                      >
                        {getNameAbbr(contact.name)}
                      </span>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <h3 className="mb-0">
                      {startCase(contact.name?.toLowerCase())}
                    </h3>

                    <div className="d-flex align-items-center gap-2">
                      <i className="ki-duotone ki-sms fs-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>{" "}
                      <a
                        // href="#"
                        className="text-muted text-hover-primary"
                      >
                        {contact.email?.toLowerCase() || "--"}
                      </a>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <i className="ki-duotone ki-phone fs-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>{" "}
                      <a
                        // href="#"
                        className="text-muted text-hover-primary"
                      >
                        {contact.phone || "--"}
                      </a>
                    </div>
                  </div>
                </div>

                <ul
                  className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 fw-semibold mt-6 mb-8 gap-2"
                  role="tablist"
                >
                  {/* <li className="nav-item" role="presentation">
                      <a
                        className="nav-link text-active-primary d-flex align-items-center pb-4 active"
                        data-bs-toggle="tab"
                        href="#kt_contact_view_general"
                        aria-selected="true"
                        role="tab"
                      >
                        <i className="ki-duotone ki-home fs-4 me-1"></i> General
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link text-active-primary d-flex align-items-center pb-4"
                        data-bs-toggle="tab"
                        href="#kt_contact_view_meetings"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <i className="ki-duotone ki-calendar-8 fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span>
                          <span className="path6"></span>
                        </i>{" "}
                        Meetings
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link text-active-primary d-flex align-items-center pb-4"
                        data-bs-toggle="tab"
                        href="#kt_contact_view_activity"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <i className="ki-duotone ki-save-2 fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>{" "}
                        Activity
                      </a>
                    </li> */}
                </ul>

                <div className="tab-content" id="">
                  <div
                    className="tab-pane fade show active"
                    id="kt_contact_view_general"
                    role="tabpanel"
                  >
                    <div className="d-flex flex-column gap-5 mt-7">
                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">Name</div>
                        <div className="fw-bold fs-5">
                          {startCase(contact.name) || "--"}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">Phone</div>
                        <div className="fw-bold fs-5">
                          {contact.phone || "--"}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">Email</div>
                        <div className="fw-bold fs-5">
                          {contact.email || "--"}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">
                          Alternative Phone
                        </div>
                        <div className="fw-bold fs-5">
                          {contact.phoneTwo || "--"}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">
                          Alternative email
                        </div>
                        <div className="fw-bold fs-5">
                          {contact.emailTwo || "--"}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <div className="fw-bold text-muted">Description</div>
                        <p>{contact.description || "--"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-xl-6">
            {contactError && contactError !== "" && (
              <div
                className="alert alert-danger"
                dangerouslySetInnerHTML={{
                  __html: `<strong>Error!</strong> ${contactError}`,
                }}
              />
            )}
            <div className="card card-flush h-lg-100" id="kt_contacts_main">
              <div className="card-header pt-7" id="kt_chat_contacts_header">
                <div className="card-title">
                  <i className="ki-duotone ki-badge fs-1 me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>{" "}
                  <h2>{editing ? "Edit Contact" : "Add New Contact"}</h2>
                </div>
              </div>

              <div className="card-body pt-5">
                <form
                  id="kt_ecommerce_settings_general_form"
                  className="form fv-plugins-bootstrap5 fv-plugins-framework"
                  action="#"
                >
                  <div className="mb-7">
                    <label className="fs-6 fw-semibold mb-3">
                      <span>Update Avatar</span>

                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        aria-label="Allowed file types: png, jpg, jpeg."
                        data-bs-original-title="Allowed file types: png, jpg, jpeg."
                        data-kt-initialized="1"
                      >
                        <i className="ki-duotone ki-information fs-7">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>{" "}
                      </span>
                    </label>

                    <div className="mt-1">
                      <div
                        className="image-input image-input-outline image-input-placeholder image-input-empty image-input-empty "
                        data-kt-image-input="true"
                      >
                        <div
                          className="image-input-wrapper w-100px h-100px"
                          style={{
                            backgroundImage: `url("${API_URL}/${
                              contactData.image
                                ? contactData.image
                                : "placeholder.jpg"
                            }")`,
                          }}
                        ></div>

                        <label
                          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                          data-kt-image-input-action="change"
                          data-bs-toggle="tooltip"
                          aria-label="Change avatar"
                          data-bs-original-title="Change avatar"
                          data-kt-initialized="1"
                        >
                          <i className="ki-duotone ki-pencil fs-7">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>

                          <input
                            type="file"
                            name="avatar"
                            accept=".png, .jpg, .jpeg"
                            onChange={(e) => {
                              if (e?.target?.files && e?.target?.files.length) {
                                uploadImage(e?.target?.files[0]);
                              }
                            }}
                          />
                          <input type="hidden" name="avatar_remove" />
                        </label>

                        <span
                          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                          data-kt-image-input-action="cancel"
                          data-bs-toggle="tooltip"
                          aria-label="Cancel avatar"
                          data-bs-original-title="Cancel avatar"
                          data-kt-initialized="1"
                        >
                          <i className="ki-duotone ki-cross fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>{" "}
                        </span>

                        <span
                          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                          data-kt-image-input-action="remove"
                          data-bs-toggle="tooltip"
                          aria-label="Remove avatar"
                          data-bs-original-title="Remove avatar"
                          data-kt-initialized="1"
                        >
                          <i className="ki-duotone ki-cross fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>{" "}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row row-cols-1 row-cols-sm-2 rol-cols-md-1 row-cols-lg-2">
                    <div className="col">
                      <div className="fv-row mb-7 fv-plugins-icon-container">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span className="required">First Name</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's email."
                            data-bs-original-title="Enter the contact's email."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-solid"
                          name="firstName"
                          value={contactData.firstName}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              firstName: e.target.value,
                            });
                          }}
                        />

                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="fv-row mb-7">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span className="required">Last Name</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's phone number (optional)."
                            data-bs-original-title="Enter the contact's phone number (optional)."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-solid"
                          name="lastName"
                          value={contactData.lastName}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              lastName: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-cols-1 row-cols-sm-2 rol-cols-md-1 row-cols-lg-2">
                    <div className="col">
                      <div className="fv-row mb-7 fv-plugins-icon-container">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span className="required">Email</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's email."
                            data-bs-original-title="Enter the contact's email."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="email"
                          className="form-control form-control-solid"
                          name="email"
                          value={contactData.email}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              email: e.target.value,
                            });
                          }}
                        />

                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="fv-row mb-7">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span className="required">Phone</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's phone number (optional)."
                            data-bs-original-title="Enter the contact's phone number (optional)."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-solid"
                          name="phone"
                          value={contactData.phone}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              phone: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-cols-1 row-cols-sm-2 rol-cols-md-1 row-cols-lg-2">
                    <div className="col">
                      <div className="fv-row mb-7 fv-plugins-icon-container">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span>Email Two</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's email."
                            data-bs-original-title="Enter the contact's email."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="email"
                          className="form-control form-control-solid"
                          name="emailTwo"
                          value={contactData.emailTwo}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              emailTwo: e.target.value,
                            });
                          }}
                        />

                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="fv-row mb-7">
                        <label className="fs-6 fw-semibold form-label mt-3">
                          <span>Phone Two</span>

                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            aria-label="Enter the contact's phone number (optional)."
                            data-bs-original-title="Enter the contact's phone number (optional)."
                            data-kt-initialized="1"
                          >
                            <i className="ki-duotone ki-information fs-7">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>{" "}
                          </span>
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-solid"
                          name="phone"
                          value={contactData.phoneTwo}
                          onChange={(e) => {
                            setContactData({
                              ...contactData,
                              phoneTwo: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-7">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Description</span>

                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        aria-label="Enter any additional notes about the contact (optional)."
                        data-bs-original-title="Enter any additional notes about the contact (optional)."
                        data-kt-initialized="1"
                      >
                        <i className="ki-duotone ki-information fs-7">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>{" "}
                      </span>
                    </label>

                    <textarea
                      className="form-control form-control-solid"
                      name="description"
                      value={contactData.description}
                      onChange={(e) => {
                        setContactData({
                          ...contactData,
                          description: e.target.value,
                        });
                      }}
                    ></textarea>
                  </div>

                  <div className="separator mb-6"></div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="reset"
                      data-kt-contacts-type="cancel"
                      className="btn btn-light me-3"
                      onClick={() => {
                        setContactOpen(true);
                        setContact(contacts[0]);
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      data-kt-contacts-type="submit"
                      className="btn btn-primary"
                    >
                      <span
                        className="indicator-label"
                        onClick={() => {
                          saveContact();
                        }}
                      >
                        Save
                      </span>
                      <span className="indicator-progress">
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      {confirmation && (
        <ConfirmationModal
          action={confirmation.action}
          message={confirmation.message}
          close={() => {
            setConfirmation(null);
          }}
        />
      )}
    </Content>
  );
}
