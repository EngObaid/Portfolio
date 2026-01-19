import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import type { Project } from "../types";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectCardSkeleton } from "../components/ProjectCardSkeleton";
import { Search } from "lucide-react";
import { Container, Section, Input, Button } from '../components/ui';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
        // Extract unique tags
        const tags = Array.from(new Set(data.flatMap((p) => p.tags)));
        setAllTags(tags);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = projects;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.summary.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    setFilteredProjects(result);
  }, [search, selectedTag, projects]);

  return (
    <Section>
      <Container>
        <div className="mb-16 space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light">
            A collection of my work, side projects, and experiments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-16 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 rounded-full"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="rounded-full"
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className="rounded-full"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} className="h-full" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border/50">
            <p className="text-lg mb-4">No projects found matching your criteria.</p>
            <Button 
              variant="outline"
              onClick={() => {setSearch(''); setSelectedTag(null)}}
            >
              Clear filters
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
