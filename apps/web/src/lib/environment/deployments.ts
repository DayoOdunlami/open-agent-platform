import { Deployment } from "@/types/deployment";

/**
 * Loads the provided deployments from the environment variable.
 * @returns {Deployment[]} The list of deployments.
 */
export function getDeployments(): Deployment[] {
  try {
    let defaultExists = false;
    const deployments: Deployment[] = JSON.parse(
      process.env.NEXT_PUBLIC_DEPLOYMENTS || "[]",
    );
    
    // If no deployments are configured, return empty array
    if (deployments.length === 0) {
      return [];
    }
    
    for (const deployment of deployments) {
      if (deployment.isDefault && !defaultExists) {
        if (!deployment.defaultGraphId) {
          console.warn("Default deployment must have a default graph ID");
          return [];
        }
        defaultExists = true;
      } else if (deployment.isDefault && defaultExists) {
        console.warn("Multiple default deployments found");
        return [];
      }
    }
    
    if (!defaultExists) {
      console.warn("No default deployment found");
      return [];
    }
    
    return deployments;
  } catch (error) {
    console.warn("Error parsing deployments:", error);
    return [];
  }
}
