import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Quote,
  FolderTree,
  ListTree,
  Bell,
  Users,
  Settings,
  LogOut,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Sticker,
  Send,
  Languages,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Portuguese",
  "Italian",
];
const STICKER_TYPES = ["popular", "emoji", "shape", "quote"];

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: isForm
      ? options.headers || {}
      : { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

function rows(data, key) {
  return Array.isArray(data)
    ? data
    : data[key] || data.data || data.results || [];
}
function total(data, fallback) {
  return Number(data.total ?? data.pagination?.total ?? fallback);
}

async function fetchAll(endpoint, key, extra = "") {
  const first = await request(`${endpoint}?page=1&limit=100${extra}`);
  const firstRows = rows(first, key);
  const t = total(first, firstRows.length);
  const pages = Math.ceil(t / 100);
  if (pages <= 1) return firstRows;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      request(`${endpoint}?page=${i + 2}&limit=100${extra}`),
    ),
  );
  return firstRows.concat(...rest.map((d) => rows(d, key)));
}
function UsersPage({ items, reload, flash }) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((user) => {
      const matchesSearch =
        !query ||
        (user.name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query);

      const matchesLanguage = !language || user.language === language;

      return matchesSearch && matchesLanguage;
    });
  }, [items, search, language]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      await request(`/users/${id}`, {
        method: "DELETE",
      });

      await reload();

      flash("success", "User deleted successfully");
    } catch (error) {
      flash("error", error.message);
    }
  };

  return (
    <section className="content">
      <div className="toolbar">
        <div>
          <h2>Users</h2>

          <p>Registered users</p>
        </div>

        <div className="toolbarActions">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All Languages</option>

            {LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="searchBox">
            <Search />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
            />
          </div>

          <button className="secondary" onClick={reload}>
            <RefreshCw />
          </button>
        </div>
      </div>

      <div className="countLine">
        Showing {filteredUsers.length} of {items.length} users
      </div>

      <div className="panel tablePanel">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Language</th>
                <th>Profile</th>
                <th>Created</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty">
                      <h2>No users found</h2>

                      <p>No registered users available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.name || "—"}</strong>
                    </td>

                    <td>{user.email || "—"}</td>

                    <td>
                      <Badge>{user.language || "English"}</Badge>
                    </td>

                    <td>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || "User"}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <small>{user._id}</small>
                    </td>

                    <td>
                      <button
                        className="danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SettingsPage({ data }) {
  const defaultSettings = {
    defaultLanguage: "Hindi",
    quotesPerPage: 20,
    allowUserQuotes: true,
    autoPublishQuotes: false,
    showAuthor: true,
    allowQuoteImage: true,
    dailyQuote: true,
    randomQuote: true,
    quoteTranslation: true,
    dailyNotification: true,
    notificationTime: "09:00",
    notificationLanguage: "Hindi",
    notificationImage: true,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quotes_admin_settings");

    if (stored) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch (error) {
        console.error("Settings parse error:", error);
      }
    }
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("quotes_admin_settings", JSON.stringify(settings));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <section className="content">
      <div className="toolbar">
        <div>
          <h2>Settings</h2>
          <p>Manage Quotes Creator application settings</p>
        </div>

        <button className="primary" onClick={saveSettings}>
          <Settings />
          Save Settings
        </button>
      </div>

      {saved && (
        <div className="toast success">
          <span>
            <CheckCircle2 />
            Settings saved successfully
          </span>
          <button onClick={() => setSaved(false)}>
            <X />
          </button>
        </div>
      )}

      <div className="panel">
        <div className="panelTitle">
          <div>
            <h2>Quote Settings</h2>
            <p>Configure quote display and management.</p>
          </div>
          <Quote />
        </div>

        <div className="settingsGrid">
          <div className="settingItem">
            <label>
              Default Quote Language
              <select
                value={settings.defaultLanguage}
                onChange={(e) => update("defaultLanguage", e.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="settingItem">
            <label>
              Quotes Per Page
              <select
                value={settings.quotesPerPage}
                onChange={(e) =>
                  update("quotesPerPage", Number(e.target.value))
                }
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settingsList">
          <SettingToggle
            title="Allow User Quotes"
            description="Allow users to submit their own quotes."
            value={settings.allowUserQuotes}
            set={(value) => update("allowUserQuotes", value)}
          />

          <SettingToggle
            title="Auto Publish Quotes"
            description="Automatically publish submitted user quotes."
            value={settings.autoPublishQuotes}
            set={(value) => update("autoPublishQuotes", value)}
          />

          <SettingToggle
            title="Show Author"
            description="Show author information with quotes."
            value={settings.showAuthor}
            set={(value) => update("showAuthor", value)}
          />

          <SettingToggle
            title="Allow Quote Image"
            description="Allow images to be attached to quotes."
            value={settings.allowQuoteImage}
            set={(value) => update("allowQuoteImage", value)}
          />

          <SettingToggle
            title="Daily Quote"
            description="Enable daily quote functionality."
            value={settings.dailyQuote}
            set={(value) => update("dailyQuote", value)}
          />

          <SettingToggle
            title="Random Quote"
            description="Allow random quotes to be displayed."
            value={settings.randomQuote}
            set={(value) => update("randomQuote", value)}
          />

          <SettingToggle
            title="Quote Translation"
            description="Enable quote translation between supported languages."
            value={settings.quoteTranslation}
            set={(value) => update("quoteTranslation", value)}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panelTitle">
          <div>
            <h2>Notification Settings</h2>
            <p>Configure daily quote notifications.</p>
          </div>
          <Bell />
        </div>

        <div className="settingsList">
          <SettingToggle
            title="Daily Notifications"
            description="Send a daily quote notification to users."
            value={settings.dailyNotification}
            set={(value) => update("dailyNotification", value)}
          />

          <SettingToggle
            title="Notification Image"
            description="Include quote image with notifications."
            value={settings.notificationImage}
            set={(value) => update("notificationImage", value)}
          />
        </div>

        <div className="settingsGrid">
          <div className="settingItem">
            <label>
              Notification Time
              <input
                type="time"
                value={settings.notificationTime}
                onChange={(e) => update("notificationTime", e.target.value)}
              />
            </label>
          </div>

          <div className="settingItem">
            <label>
              Notification Language
              <select
                value={settings.notificationLanguage}
                onChange={(e) => update("notificationLanguage", e.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panelTitle">
          <div>
            <h2>Database Summary</h2>
            <p>Currently loaded records from your backend.</p>
          </div>
          <Settings />
        </div>

        <div className="summary">
          <div>
            <b>{data.quotes.length}</b>
            <span>Quotes</span>
          </div>

          <div>
            <b>{data.categories.length}</b>
            <span>Categories</span>
          </div>

          <div>
            <b>{data.subcategories.length}</b>
            <span>Subcategories</span>
          </div>

          <div>
            <b>{data.users.length}</b>
            <span>Users</span>
          </div>

          <div>
            <b>{data.stickers.length}</b>
            <span>Stickers</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panelTitle">
          <div>
            <h2>Application</h2>
            <p>General application information.</p>
          </div>
          <Settings />
        </div>

        <div className="settingsGrid">
          <div className="settingItem">
            <label>
              Application Name
              <input value="Quotes Creator" readOnly />
            </label>
          </div>

          <div className="settingItem">
            <label>
              Admin Panel
              <input value="Super Admin" readOnly />
            </label>
          </div>

          <div className="settingItem">
            <label>
              API URL
              <input value={API} readOnly />
            </label>
          </div>

          <div className="settingItem">
            <label>
              Supported Languages
              <input value={`${LANGUAGES.length} languages`} readOnly />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingToggle({ title, description, value, set }) {
  return (
    <div className="settingToggle">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${value ? "active" : ""}`}
        onClick={() => set(!value)}
        aria-pressed={value}
      >
        <span />
      </button>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState({
    categories: [],
    subcategories: [],
    quotes: [],
    stickers: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadAll = async () => {
    setLoading(true);

    try {
      const [categories, subcategories, quotes, stickers, users] =
        await Promise.all([
          fetchAll("/categories", "categories"),

          fetchAll("/subcategories", "subcategories"),

          fetchAll("/quotes", "quotes"),

          request("/stickers").then((d) => rows(d, "stickers")),

          fetchAll("/users", "users"),
        ]);

      setData({
        categories,
        subcategories,
        quotes,
        stickers,
        users,
      });
    } catch (e) {
      setNotice({
        type: "error",
        text: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const flash = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="app">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <div className="logo">Q</div>
          {!collapsed && (
            <div>
              <b>Quotes Creator</b>
              <span>Admin Panel</span>
            </div>
          )}
        </div>
        <nav>
          <Nav
            active={page === "dashboard"}
            icon={<LayoutDashboard />}
            text="Dashboard"
            click={() => setPage("dashboard")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "quotes"}
            icon={<Quote />}
            text="Quotes"
            click={() => setPage("quotes")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "categories"}
            icon={<FolderTree />}
            text="Categories"
            click={() => setPage("categories")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "subcategories"}
            icon={<ListTree />}
            text="Subcategories"
            click={() => setPage("subcategories")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "stickers"}
            icon={<Sticker />}
            text="Stickers"
            click={() => setPage("stickers")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "ai"}
            icon={<Sparkles />}
            text="AI Quote"
            click={() => setPage("ai")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "notifications"}
            icon={<Bell />}
            text="Notifications"
            click={() => setPage("notifications")}
            collapsed={collapsed}
          />
          <div className="navTitle">SYSTEM</div>
          <Nav
            active={page === "users"}
            icon={<Users />}
            text="Users"
            click={() => setPage("users")}
            collapsed={collapsed}
          />
          <Nav
            active={page === "settings"}
            icon={<Settings />}
            text="Settings"
            click={() => setPage("settings")}
            collapsed={collapsed}
          />
        </nav>
        <div className="logout">
          <LogOut />
          {!collapsed && "Logout"}
        </div>
      </aside>

      <main className={`main ${collapsed ? "wide" : ""}`}>
        <header>
          <button
            className="iconButton"
            onClick={() => setCollapsed((v) => !v)}
          >
            <Menu />
          </button>
          <div className="heading">
            <h1>{title(page)}</h1>
            <span>Quotes Creator / {title(page)}</span>
          </div>
          <div className="headerRight">
            <button className="refresh" onClick={loadAll}>
              <RefreshCw className={loading ? "spin" : ""} />
            </button>
            <div className="avatar">A</div>
            <div className="admin">
              Admin<span>Super Admin</span>
            </div>
          </div>
        </header>

        {notice && (
          <div
            className={`toast ${notice.type === "error" ? "error" : "success"}`}
          >
            <span>
              {notice.type === "error" ? <AlertCircle /> : <CheckCircle2 />}
              {notice.text}
            </span>
            <button onClick={() => setNotice(null)}>
              <X />
            </button>
          </div>
        )}
        {loading && (
          <div className="loading">
            <RefreshCw className="spin" /> Loading complete database...
          </div>
        )}

        {page === "dashboard" && <Dashboard data={data} go={setPage} />}
        {page === "categories" && (
          <Categories items={data.categories} reload={loadAll} flash={flash} />
        )}
        {page === "subcategories" && (
          <Subcategories
            items={data.subcategories}
            categories={data.categories}
            reload={loadAll}
            flash={flash}
          />
        )}
        {page === "quotes" && (
          <Quotes
            items={data.quotes}
            categories={data.categories}
            subcategories={data.subcategories}
            reload={loadAll}
            flash={flash}
          />
        )}
        {page === "stickers" && (
          <Stickers items={data.stickers} reload={loadAll} flash={flash} />
        )}
        {page === "ai" && <AIQuote flash={flash} />}
        {page === "notifications" && <Notifications flash={flash} />}
        {page === "users" && (
          <UsersPage items={data.users || []} reload={loadAll} flash={flash} />
        )}
        {page === "settings" && <SettingsPage data={data} />}
      </main>
    </div>
  );
}

function title(p) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}
function Nav({ active, icon, text, click, collapsed }) {
  return (
    <button
      className={`nav ${active ? "active" : ""}`}
      onClick={click}
      title={collapsed ? text : ""}
    >
      {icon}
      {!collapsed && <span>{text}</span>}
    </button>
  );
}

function Dashboard({ data, go }) {
  const counts = {
    categories: data.categories.length,
    subcategories: data.subcategories.length,
    quotes: data.quotes.length,
    stickers: data.stickers.length,
  };
  return (
    <section className="content">
      <div className="stats">
        <Stat icon={<Quote />} label="All Quotes" value={counts.quotes} />
        <Stat
          icon={<FolderTree />}
          label="Categories"
          value={counts.categories}
        />
        <Stat
          icon={<ListTree />}
          label="Subcategories"
          value={counts.subcategories}
        />
        <Stat icon={<Sticker />} label="Stickers" value={counts.stickers} />
      </div>
      <div className="grid">
        <div className="panel">
          <div className="panelTitle">
            <div>
              <h2>Database Summary</h2>
              <p>Loaded from your existing backend</p>
            </div>
          </div>
          <div className="summary">
            <div>
              <b>{counts.quotes}</b>
              <span>Quotes</span>
            </div>
            <div>
              <b>{counts.categories}</b>
              <span>Categories</span>
            </div>
            <div>
              <b>{counts.subcategories}</b>
              <span>Subcategories</span>
            </div>
            <div>
              <b>{counts.stickers}</b>
              <span>Stickers</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panelTitle">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick">
            <button onClick={() => go("quotes")}>
              <Plus /> Add Quote
            </button>
            <button onClick={() => go("categories")}>
              <Plus /> Add Category
            </button>
            <button onClick={() => go("subcategories")}>
              <Plus /> Add Subcategory
            </button>
            <button onClick={() => go("ai")}>
              <Sparkles /> Generate AI Quote
            </button>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panelTitle">
          <h2>Data Integrity</h2>
        </div>
        <div className="integrity">
          <Check label="Categories loaded" ok={counts.categories > 0} />
          <Check label="Subcategories loaded" ok={counts.subcategories > 0} />
          <Check label="Quotes loaded" ok={counts.quotes > 0} />
          <Check label="Stickers endpoint available" ok={true} />
        </div>
      </div>
    </section>
  );
}
function Check({ label, ok }) {
  return (
    <div className={ok ? "ok" : "bad"}>
      {ok ? <CheckCircle2 /> : <AlertCircle />}
      {label}
    </div>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <div className="statIcon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Toolbar({ title, search, setSearch, add, children }) {
  return (
    <div className="toolbar">
      <div>
        <h2>{title}</h2>
        <p>Complete database · CRUD · search · all records</p>
      </div>
      <div className="toolbarActions">
        {children}
        <div className="searchBox">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
        <button className="primary" onClick={add}>
          <Plus /> Add
        </button>
      </div>
    </div>
  );
}

function Categories({ items, reload, flash }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const empty = {
    name: "",
    description: "",
    translations: { English: "" },
    image: null,
  };

  const [form, setForm] = useState(empty);

  // Search
  const filtered = useMemo(() => {
    return items.filter((x) =>
      (x.name || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  // Search change hone par page 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Current 10 records
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return filtered.slice(start, end);
  }, [filtered, page]);

  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("translations", JSON.stringify(form.translations));

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      await request(editing ? `/categories/${editing}` : "/categories", {
        method: editing ? "PUT" : "POST",
        body: fd,
      });

      setOpen(false);

      await reload();

      flash("success", editing ? "Category updated" : "Category created");
    } catch (e) {
      flash("error", e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await request(`/categories/${id}`, {
        method: "DELETE",
      });

      await reload();

      // Agar last item delete hua ho
      if (paginatedItems.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }

      flash("success", "Category deleted");
    } catch (e) {
      flash("error", e.message);
    }
  };

  return (
    <section className="content">
      <Toolbar
        title="Categories"
        search={search}
        setSearch={setSearch}
        add={() => {
          setEditing(null);
          setForm(empty);
          setOpen(true);
        }}
      />

      {/* Count */}
      <div className="countLine">
        Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
        categories
      </div>

      {/* Categories */}
      <div className="cards">
        {paginatedItems.length === 0 ? (
          <div className="empty">
            <h2>No categories found</h2>
            <p>No categories available.</p>
          </div>
        ) : (
          paginatedItems.map((c) => (
            <div className="card" key={c._id}>
              {/* Image */}
              <div className="imageThumb">
                {c.image ? <img src={c.image} alt={c.name} /> : <ImageIcon />}
              </div>

              {/* Content */}
              <div className="cardBody">
                <h3>{c.name}</h3>

                <p>{c.description || "No description"}</p>

                <small>English: {c.translations?.English || "—"}</small>

                <small>ID: {c._id}</small>
              </div>

              {/* Actions */}
              <RowActions
                edit={() => {
                  setEditing(c._id);

                  setForm({
                    name: c.name || "",
                    description: c.description || "",
                    translations: {
                      ...c.translations,
                      English: c.translations?.English || "",
                    },
                    image: null,
                  });

                  setOpen(true);
                }}
                del={() => remove(c._id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="secondary"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="pageNumbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={page === pageNumber ? "pageActive" : "pageButton"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>

          <button
            className="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {open && (
        <Modal
          title={editing ? "Edit Category" : "Create Category"}
          close={() => setOpen(false)}
        >
          <form onSubmit={save}>
            <Field
              label="Name"
              value={form.name}
              set={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
              required
            />

            <Field
              label="Description"
              value={form.description}
              set={(v) =>
                setForm({
                  ...form,
                  description: v,
                })
              }
            />

            <Field
              label="English Translation"
              value={form.translations.English || ""}
              set={(v) =>
                setForm({
                  ...form,
                  translations: {
                    ...form.translations,
                    English: v,
                  },
                })
              }
            />

            {/* Image optional */}
            <FileField
              label="Category Image (optional)"
              set={(f) =>
                setForm({
                  ...form,
                  image: f,
                })
              }
              required={false}
            />

            <button className="primary full">Save Category</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function Subcategories({ items, categories, reload, flash }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const empty = {
    categoryId: "",
    name: "",
    description: "",
    translations: {
      English: "",
    },
    image: null,
  };

  const [form, setForm] = useState(empty);

  // ==============================
  // FILTER
  // ==============================

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const matchesCategory =
        !categoryFilter ||
        String(s.categoryId?._id || s.categoryId) === String(categoryFilter);

      const matchesSearch = (s.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, search, categoryFilter]);

  // ==============================
  // RESET PAGE WHEN FILTER CHANGES
  // ==============================

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  // ==============================
  // TOTAL PAGES
  // ==============================

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // ==============================
  // KEEP PAGE VALID
  // ==============================

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==============================
  // PAGINATED DATA
  // ==============================

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // ==============================
  // CATEGORY NAME
  // ==============================

  const catName = (s) =>
    s.categoryId?.name ||
    categories.find((c) => String(c._id) === String(s.categoryId))?.name ||
    "—";

  // ==============================
  // SAVE
  // ==============================

  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("categoryId", form.categoryId);

      fd.append("name", form.name);

      fd.append("description", form.description);

      fd.append("translations", JSON.stringify(form.translations));

      // Image optional
      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      await request(editing ? `/subcategories/${editing}` : "/subcategories", {
        method: editing ? "PUT" : "POST",
        body: fd,
      });

      setOpen(false);

      await reload();

      flash("success", editing ? "Subcategory updated" : "Subcategory created");
    } catch (e) {
      flash("error", e.message);
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const remove = async (id) => {
    if (!confirm("Delete this subcategory?")) {
      return;
    }

    try {
      await request(`/subcategories/${id}`, {
        method: "DELETE",
      });

      await reload();

      flash("success", "Subcategory deleted");
    } catch (e) {
      flash("error", e.message);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <section className="content">
      <Toolbar
        title="Subcategories"
        search={search}
        setSearch={setSearch}
        add={() => {
          setEditing(null);

          setForm({
            ...empty,
            categoryId: categories[0]?._id || "",
          });

          setOpen(true);
        }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </Toolbar>

      {/* COUNT */}

      <div className="countLine">
        Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
        subcategories
      </div>

      {/* CARDS */}

      <div className="cards">
        {paginatedItems.length === 0 ? (
          <div className="empty">
            <h2>No subcategories found</h2>

            <p>No subcategories available.</p>
          </div>
        ) : (
          paginatedItems.map((s) => (
            <div className="card" key={s._id}>
              <div className="imageThumb">
                {s.image ? <img src={s.image} alt={s.name} /> : <ListTree />}
              </div>

              <div className="cardBody">
                <h3>{s.name}</h3>

                <p>
                  Category: <b>{catName(s)}</b>
                </p>

                <p>{s.description || "No description"}</p>

                <small>English: {s.translations?.English || "—"}</small>

                <small>ID: {s._id}</small>
              </div>

              <RowActions
                edit={() => {
                  setEditing(s._id);

                  setForm({
                    categoryId: s.categoryId?._id || s.categoryId || "",

                    name: s.name || "",

                    description: s.description || "",

                    translations: {
                      English: s.translations?.English || "",
                    },

                    image: null,
                  });

                  setOpen(true);
                }}
                del={() => remove(s._id)}
              />
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="secondary"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="pageNumbers">
            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={page === pageNumber ? "pageActive" : "pageButton"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            className="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* MODAL */}

      {open && (
        <Modal
          title={editing ? "Edit Subcategory" : "Create Subcategory"}
          close={() => setOpen(false)}
        >
          <form onSubmit={save}>
            <label>
              Category
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  })
                }
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <Field
              label="Name"
              value={form.name}
              set={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
              required
            />

            <Field
              label="Description"
              value={form.description}
              set={(v) =>
                setForm({
                  ...form,
                  description: v,
                })
              }
            />

            <Field
              label="English Translation"
              value={form.translations.English || ""}
              set={(v) =>
                setForm({
                  ...form,
                  translations: {
                    ...form.translations,
                    English: v,
                  },
                })
              }
            />

            <FileField
              label="Image (optional)"
              set={(f) =>
                setForm({
                  ...form,
                  image: f,
                })
              }
              required={false}
            />

            <button className="primary full">Save Subcategory</button>
          </form>
        </Modal>
      )}
    </section>
  );
}
function Quotes({ items, categories, subcategories, reload, flash }) {
  const [search, setSearch] = useState("");

  const [language, setLanguage] = useState("");

  const [catFilter, setCatFilter] = useState("");

  const [subFilter, setSubFilter] = useState("");

  const [draft, setDraft] = useState("");

  const [source, setSource] = useState("");

  const [open, setOpen] = useState(false);

  const [view, setView] = useState(null);

  const [editing, setEditing] = useState(null);

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const empty = {
    categoryId: "",
    subcategoryId: "",
    text: "",
    author: "Unknown",
    language: "Hindi",

    translations: {
      English: "",
    },

    isDraft: false,
    source: "admin",
    image: null,
  };

  const [form, setForm] = useState(empty);

  // ==============================
  // FILTER
  // ==============================

  const filtered = useMemo(() => {
    return items.filter((q) => {
      const searchText =
        (q.text || "").toLowerCase().includes(search.toLowerCase()) ||
        (q.author || "").toLowerCase().includes(search.toLowerCase());

      const matchesSearch = !search || searchText;

      const matchesLanguage = !language || q.language === language;

      const matchesCategory =
        !catFilter ||
        String(q.categoryId?._id || q.categoryId) === String(catFilter);

      const matchesSubcategory =
        !subFilter ||
        String(q.subcategoryId?._id || q.subcategoryId) === String(subFilter);

      const matchesDraft = draft === "" || String(q.isDraft) === draft;

      const matchesSource = !source || q.source === source;

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesCategory &&
        matchesSubcategory &&
        matchesDraft &&
        matchesSource
      );
    });
  }, [items, search, language, catFilter, subFilter, draft, source]);

  // ==============================
  // RESET PAGE
  // ==============================

  useEffect(() => {
    setPage(1);
  }, [search, language, catFilter, subFilter, draft, source]);

  // ==============================
  // TOTAL PAGES
  // ==============================

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // ==============================
  // KEEP PAGE VALID
  // ==============================

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==============================
  // PAGINATED QUOTES
  // ==============================

  const paginatedQuotes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // ==============================
  // CATEGORY NAME
  // ==============================

  const catName = (q) =>
    q.categoryId?.name ||
    categories.find((c) => String(c._id) === String(q.categoryId))?.name ||
    "—";

  // ==============================
  // SUBCATEGORY NAME
  // ==============================

  const subName = (q) =>
    q.subcategoryId?.name ||
    subcategories.find((s) => String(s._id) === String(q.subcategoryId))
      ?.name ||
    "—";

  // ==============================
  // SAVE
  // ==============================

  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("categoryId", form.categoryId);

      fd.append("subcategoryId", form.subcategoryId || "");

      fd.append("text", form.text);

      fd.append("author", form.author);

      fd.append("language", form.language);

      fd.append("isDraft", form.isDraft);

      fd.append("source", form.source);

      fd.append("translations", JSON.stringify(form.translations));

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      await request(editing ? `/quotes/${editing}` : "/quotes", {
        method: editing ? "PUT" : "POST",
        body: fd,
      });

      setOpen(false);

      await reload();

      flash("success", editing ? "Quote updated" : "Quote created");
    } catch (e) {
      flash("error", e.message);
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const remove = async (id) => {
    if (!confirm("Delete this quote?")) {
      return;
    }

    try {
      await request(`/quotes/${id}`, {
        method: "DELETE",
      });

      await reload();

      flash("success", "Quote deleted");
    } catch (e) {
      flash("error", e.message);
    }
  };

  // ==============================
  // EDIT
  // ==============================

  const edit = (q) => {
    setEditing(q._id);

    setForm({
      categoryId: q.categoryId?._id || q.categoryId || "",

      subcategoryId: q.subcategoryId?._id || q.subcategoryId || "",

      text: q.text || "",

      author: q.author || "Unknown",

      language: q.language || "Hindi",

      translations: {
        English: q.translations?.English || "",
      },

      isDraft: !!q.isDraft,

      source: q.source || "admin",

      image: null,
    });

    setOpen(true);
  };

  // ==============================
  // FORM SUBCATEGORIES
  // ==============================

  const formSubs = subcategories.filter(
    (s) =>
      String(s.categoryId?._id || s.categoryId) === String(form.categoryId),
  );

  return (
    <section className="content">
      {/* HEADER */}

      <div className="toolbar">
        <div>
          <h2>Quotes</h2>

          <p>Showing {filtered.length} records</p>
        </div>

        <div className="toolbarActions">
          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);

              setSubFilter("");
            }}
          >
            <option value="">All Categories</option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
          >
            <option value="">All Subcategories</option>

            {subcategories
              .filter(
                (s) =>
                  !catFilter ||
                  String(s.categoryId?._id || s.categoryId) ===
                    String(catFilter),
              )
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All Languages</option>

            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <div className="searchBox">
            <Search />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes..."
            />
          </div>

          <button
            className="primary"
            onClick={() => {
              setEditing(null);

              setForm({
                ...empty,
                categoryId: categories[0]?._id || "",
              });

              setOpen(true);
            }}
          >
            <Plus />
            Add Quote
          </button>
        </div>
      </div>

      {/* FILTER ROW */}

      <div className="filterRow">
        <select value={draft} onChange={(e) => setDraft(e.target.value)}>
          <option value="">Draft + Published</option>

          <option value="false">Published</option>

          <option value="true">Drafts</option>
        </select>

        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All Sources</option>

          <option>admin</option>

          <option>user</option>

          <option>ai</option>
        </select>

        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
      </div>

      {/* TABLE */}

      <div className="panel tablePanel">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Quote</th>

                <th>Author</th>

                <th>Category</th>

                <th>Subcategory</th>

                <th>Lang</th>

                <th>Source</th>

                <th>Draft</th>

                <th>Views</th>

                <th>Translation</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="empty">
                      <h2>No quotes found</h2>

                      <p>No quotes match the current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map((q) => (
                  <tr key={q._id}>
                    <td className="quoteText">{q.text}</td>

                    <td>{q.author || "Unknown"}</td>

                    <td>
                      <Badge>{catName(q)}</Badge>
                    </td>

                    <td>
                      <Badge>{subName(q)}</Badge>
                    </td>

                    <td>{q.language}</td>

                    <td>{q.source}</td>

                    <td>
                      {q.isDraft ? (
                        <Badge red>Draft</Badge>
                      ) : (
                        <Badge green>Published</Badge>
                      )}
                    </td>

                    <td>{q.views ?? 0}</td>

                    <td>
                      {q.translations?.English ? <Languages size={16} /> : "—"}
                    </td>

                    <td>
                      <RowActions
                        view={() => setView(q)}
                        edit={() => edit(q)}
                        del={() => remove(q._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="secondary"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="pageNumbers">
            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={page === pageNumber ? "pageActive" : "pageButton"}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            className="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* QUOTE MODAL */}

      {open && (
        <Modal
          title={editing ? "Edit Quote" : "Create Quote"}
          close={() => setOpen(false)}
        >
          <form onSubmit={save}>
            <label>
              Category
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                    subcategoryId: "",
                  })
                }
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subcategory
              <select
                value={form.subcategoryId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subcategoryId: e.target.value,
                  })
                }
              >
                <option value="">No Subcategory</option>

                {formSubs.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Language
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language: e.target.value,
                  })
                }
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>

            <label>
              Quote Text
              <textarea
                required
                value={form.text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    text: e.target.value,
                  })
                }
              />
            </label>

            <Field
              label="Author"
              value={form.author}
              set={(v) =>
                setForm({
                  ...form,
                  author: v,
                })
              }
            />

            <Field
              label="English Translation"
              value={form.translations.English || ""}
              set={(v) =>
                setForm({
                  ...form,
                  translations: {
                    ...form.translations,
                    English: v,
                  },
                })
              }
            />

            <label className="check">
              <input
                type="checkbox"
                checked={form.isDraft}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDraft: e.target.checked,
                  })
                }
              />
              Draft
            </label>

            <label>
              Source
              <select
                value={form.source}
                onChange={(e) =>
                  setForm({
                    ...form,
                    source: e.target.value,
                  })
                }
              >
                <option>admin</option>

                <option>user</option>

                <option>ai</option>
              </select>
            </label>

            <FileField
              label="Quote Image (optional)"
              set={(f) =>
                setForm({
                  ...form,
                  image: f,
                })
              }
              required={false}
            />

            <button className="primary full">Save Quote</button>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}

      {view && (
        <Modal title="Quote Details" close={() => setView(null)}>
          <div className="detailQuote">
            {view.image && <img src={view.image} alt="" />}

            <blockquote>{view.text}</blockquote>

            <p>
              <b>Author:</b> {view.author}
            </p>

            <p>
              <b>Language:</b> {view.language}
            </p>

            <p>
              <b>Category:</b> {catName(view)}
            </p>

            <p>
              <b>Subcategory:</b> {subName(view)}
            </p>

            <p>
              <b>English:</b> {view.translations?.English || "—"}
            </p>

            <p>
              <b>Views:</b> {view.views ?? 0}
            </p>

            <p>
              <b>Source:</b> {view.source}
            </p>

            <p>
              <b>ID:</b> {view._id}
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Stickers({ items, reload, flash }) {
  const [open, setOpen] = useState(false),
    [editing, setEditing] = useState(null),
    [type, setType] = useState(""),
    [search, setSearch] = useState("");
  const empty = {
    name: "",
    image: "",
    type: "popular",
    sortOrder: 0,
    isActive: true,
  };
  const [form, setForm] = useState(empty);
  const filtered = items.filter(
    (s) =>
      (!type || s.type === type) &&
      (s.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const save = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name,
        image: form.image,
        type: form.type,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };
      await request(editing ? `/stickers/${editing}` : "/stickers", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      setOpen(false);
      reload();
      flash("success", editing ? "Sticker updated" : "Sticker created");
    } catch (e) {
      flash("error", e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete sticker?")) return;
    try {
      await request(`/stickers/${id}`, { method: "DELETE" });
      reload();
      flash("success", "Sticker deleted");
    } catch (e) {
      flash("error", e.message);
    }
  };
  return (
    <section className="content">
      <Toolbar
        title="Stickers"
        search={search}
        setSearch={setSearch}
        add={() => {
          setEditing(null);
          setForm(empty);
          setOpen(true);
        }}
      >
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {STICKER_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Toolbar>
      <div className="stickerGrid">
        {filtered.map((s) => (
          <div className="stickerCard" key={s._id}>
            <img src={s.image} />
            <div>
              <h3>{s.name}</h3>
              <Badge>{s.type}</Badge>
              <p>
                Order: {s.sortOrder} · {s.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <RowActions
              edit={() => {
                setEditing(s._id);
                setForm({ ...s });
                setOpen(true);
              }}
              del={() => remove(s._id)}
            />
          </div>
        ))}
      </div>
      {open && (
        <Modal
          title={editing ? "Edit Sticker" : "Create Sticker"}
          close={() => setOpen(false)}
        >
          <form onSubmit={save}>
            <Field
              label="Name"
              value={form.name}
              set={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Image URL"
              value={form.image}
              set={(v) => setForm({ ...form, image: v })}
              required
            />
            <label>
              Type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {STICKER_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <Field
              label="Sort Order"
              value={form.sortOrder}
              set={(v) => setForm({ ...form, sortOrder: v })}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={!!form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />{" "}
              Active
            </label>
            <button className="primary full">Save Sticker</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function AIQuote({ flash }) {
  const [form, setForm] = useState({
      category: "Motivation",
      mood: "Positive",
      language: "English",
    }),
    [quote, setQuote] = useState(""),
    [busy, setBusy] = useState(false);
  const generate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await request("/ai/generate", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setQuote(d.quote || "");
      flash("success", "AI quote generated");
    } catch (e) {
      flash("error", e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="content">
      <div className="panel aiPanel">
        <div className="panelTitle">
          <div>
            <h2>AI Quote Generator</h2>
            <p>
              Uses your existing POST /api/ai/generate endpoint and Groq model.
            </p>
          </div>
          <Sparkles />
        </div>
        <form onSubmit={generate}>
          <Field
            label="Category"
            value={form.category}
            set={(v) => setForm({ ...form, category: v })}
          />
          <Field
            label="Mood"
            value={form.mood}
            set={(v) => setForm({ ...form, mood: v })}
          />
          <label>
            Language
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <button className="primary full" disabled={busy}>
            {busy ? (
              <>
                <RefreshCw className="spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles /> Generate Quote
              </>
            )}
          </button>
        </form>
        {quote && (
          <div className="generated">
            <span>Generated Quote</span>
            <blockquote>{quote}</blockquote>
            <button onClick={() => navigator.clipboard?.writeText(quote)}>
              Copy
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Notifications({ flash }) {
  const [busy, setBusy] = useState(false),
    [result, setResult] = useState(null);
  const send = async () => {
    if (
      !confirm(
        "Send the backend's current notification broadcast to all active devices?",
      )
    )
      return;
    setBusy(true);
    try {
      const d = await request("/notifications/send", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setResult(d);
      flash("success", "Notification broadcast completed");
    } catch (e) {
      flash("error", e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="content">
      <div className="panel notificationPanel">
        <div className="panelTitle">
          <div>
            <h2>Notification Broadcast</h2>
            <p>
              Your backend currently sends its configured multilingual daily
              notification to active FCM devices.
            </p>
          </div>
          <Bell />
        </div>
        <button className="primary" onClick={send} disabled={busy}>
          {busy ? (
            <>
              <RefreshCw className="spin" /> Sending...
            </>
          ) : (
            <>
              <Send /> Send Broadcast
            </>
          )}
        </button>
        {result && (
          <div className="result">
            <p>
              <b>Total Devices:</b> {result.totalDevices}
            </p>
            <p>
              <b>Success:</b> {result.totalSuccess}
            </p>
            <p>
              <b>Failed:</b> {result.totalFailed}
            </p>
            <pre>{JSON.stringify(result.languages, null, 2)}</pre>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, value, set, required = false }) {
  return (
    <label>
      {label}
      {required && " *"}
      <input
        required={required}
        value={value ?? ""}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
function FileField({ label, set, required = false }) {
  return (
    <label>
      {label}
      <input
        type="file"
        accept="image/*"
        required={required}
        onChange={(e) => set(e.target.files?.[0] || null)}
      />
    </label>
  );
}
function RowActions({ view, edit, del }) {
  return (
    <div className="rowActions">
      {view && (
        <button onClick={view} title="View">
          <Eye />
        </button>
      )}
      <button onClick={edit} title="Edit">
        <Pencil />
      </button>
      <button onClick={del} className="danger" title="Delete">
        <Trash2 />
      </button>
    </div>
  );
}
function Badge({ children, green, red }) {
  return (
    <span className={`badge ${green ? "green" : ""} ${red ? "red" : ""}`}>
      {children}
    </span>
  );
}
function Modal({ title, close, children }) {
  return (
    <div className="modalBack">
      <div className="modal">
        <div className="modalHeader">
          <h2>{title}</h2>
          <button onClick={close}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Unavailable({ title, text }) {
  return (
    <section className="content">
      <div className="empty">
        <Settings />
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
